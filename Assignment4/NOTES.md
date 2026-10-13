

## 1. WSDL vs OpenAPI Line Count

The WSDL file in Assignment 3 (`partner.wsdl`) contains **72 lines**, while the OpenAPI file in Assignment 4 (`openapi.yaml`) contains **226 lines**. Therefore, the OpenAPI file has **154 more lines**.

The difference in line count does not mean that REST is more complicated than SOAP. Assignment 3 describes the Payment Service, whereas Assignment 4 describes the Listing Service. The files define different services and their requirements, so the difference is not caused by the technology alone.

Two things declared in WSDL that OpenAPI does not need in the same form are:

1. **SOAP bindings:** WSDL specifies how abstract operations are connected to SOAP messages and a communication protocol.
2. **Service and port declarations:** WSDL defines service endpoints and the ports through which clients access them. In OpenAPI, the API description and its server URLs are represented differently.

OpenAPI focuses on describing HTTP endpoints, methods, parameters, request bodies, responses, and schemas.

## 2. SOAP Fault vs REST Error Response

In Assignment 3, the SOAP fault example contains:

```xml
<soap:Fault>
    <faultcode>soap:Client</faultcode>
    <faultstring>Payment declined by the bank</faultstring>
    <detail>
        <pay:PaymentError>
            <pay:errorCode>PAYMENT_DECLINED</pay:errorCode>
            <pay:paymentId>PAY901</pay:paymentId>
        </pay:PaymentError>
    </detail>
</soap:Fault>
```

The SOAP fault communicates that the payment was declined and provides additional information about the error.

In Assignment 4, the Listing Service uses HTTP status codes and a JSON problem response. For example, when the owner service is unavailable, the Listing Service returns **HTTP 503 Service Unavailable** with a response body similar to:

```json
{
  "type": "https://errors.hostel-pg.example/503",
  "title": "Owner service unavailable",
  "status": 503,
  "detail": "Eligibility could not be checked; retry with the same Idempotency-Key."
}
```

These are examples from two different services, not direct mappings of the same error. The SOAP example represents a declined payment, whereas the REST example represents an unavailable owner service.

Returning an error inside **HTTP 200 OK** is a problem because HTTP 200 tells intermediaries, monitoring systems, caches, and clients that the request succeeded at the HTTP level. They may not inspect the response body to discover the failure. Using an appropriate HTTP error status, such as 503 for a temporary service outage, makes the failure easier to detect and handle correctly.

## 3. UDDI Publish, Find, and Bind

In the traditional SOAP web-service model, UDDI supports three main activities:

- **Publish:** A service provider publishes information about a web service in a registry.
- **Find:** A client searches the registry to discover a suitable service.
- **Bind:** The client obtains the service description and endpoint information needed to communicate with the service.

In modern REST APIs, these activities still exist conceptually, but they are not usually performed through a dedicated UDDI registry.

- **Publish** is commonly handled by publishing API documentation, such as an OpenAPI specification, in a repository or API catalogue.
- **Find** is handled through documentation portals, API catalogues, repositories, or service-discovery tools.
- **Bind** is handled by configuring the API's base URL and using the documented HTTP methods, paths, and request formats.

Therefore, the dedicated UDDI workflow has largely disappeared from typical REST API development. API documentation, repositories, catalogues, configuration, and service-discovery tools perform similar jobs.

## 4. Runtime Validation in Assignment 4

In SOAP-based development, an XML Schema associated with the service contract can be used to validate XML messages against the defined structure and data types.

In Assignment 4, OpenAPI describes the expected API requests and responses, but writing an OpenAPI schema does not automatically guarantee that every incoming request is validated at runtime. The application code must enforce the required rules.

The Listing Service performs request validation in its application code. The relevant validation function should be identified in `app.py` (for example, `validate()` if that is the function defined in the current implementation).

Without runtime validation, invalid requests could reach the business logic. For example:

- A request might omit the required `monthlyRent` field.
- A request might provide a string instead of an integer for `monthlyRent`.
- A request might use an unsupported field such as `rent` instead of `monthlyRent`.

Validation helps reject malformed requests with an appropriate client error instead of allowing invalid data to enter the application.

## 5. When Would SOAP Be Preferred Over REST?

SOAP could be preferred when integrating with an enterprise or financial partner that requires specific WS-* standards, such as WS-Security, for message-level security.

For example, WS-Security can support message-level digital signatures and encryption. When configured correctly, these mechanisms can help provide message integrity and confidentiality, including when a SOAP message passes through intermediaries.

The specific guarantee is that a signed message can be checked for unauthorized modification, while encryption can protect the message content from unauthorized reading by parties that do not possess the required keys.

These guarantees do not happen automatically just because SOAP is used; they depend on the security standards, policies, keys, and implementation being configured correctly.

For the Hostel PG Tracker Listing Service, REST with OpenAPI is a suitable choice because the service mainly exposes HTTP operations for creating, viewing, updating, and changing the status of listings. SOAP would add complexity without a clear requirement for SOAP-specific features.