using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Api.Infrastructure
{
    /// <summary>
    /// Represents the Swagger/Swashbuckle operation filter used to document information provided by API versioning.
    /// </summary>
    public class SwaggerDefaultValues : IOperationFilter
    {
        /// <summary>
        /// Applies the filter to the specified operation using the given context.
        /// </summary>
        /// <param name="operation">The operation to apply the filter to.</param>
        /// <param name="context">The current operation filter context.</param>
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var apiDescription = context.ApiDescription;

            operation.Deprecated |= apiDescription.IsDeprecated();

            // Reference the controller version
            if (context.ApiDescription.ActionDescriptor?.EndpointMetadata == null)
                return;

            // Handle API version parameters
            if (operation.Parameters.Any(p => p.Name == "version"))
            {
                var versionParameter = operation.Parameters.First(p => p.Name == "version");
                operation.Parameters.Remove(versionParameter);
            }

            // Remove parameters that are marked as obsolete
            foreach (var parameter in context.ApiDescription.ParameterDescriptions)
            {
                var description = apiDescription.ParameterDescriptions
                    .First(p => p.Name == parameter.Name);

                if (parameter.IsRequired)
                {
                    if (operation.Parameters != null)
                    {
                        var openApiParameter = operation.Parameters
                            .FirstOrDefault(p => p.Name == parameter.Name);
                        
                        if (openApiParameter != null)
                        {
                            openApiParameter.Required = true;
                        }
                    }
                }

                var routeInfo = description.RouteInfo;

                if (routeInfo != null)
                {
                    if (operation.Parameters != null)
                    {
                        var openApiParam = operation.Parameters
                            .FirstOrDefault(p => p.Name == parameter.Name);
                        
                        if (openApiParam != null)
                        {
                            if (openApiParam.Description == null)
                            {
                                openApiParam.Description = description.ModelMetadata?.Description;
                            }
                        }
                    }
                }
            }
        }
    }
} 