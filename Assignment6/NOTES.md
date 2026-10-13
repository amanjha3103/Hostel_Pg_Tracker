# Answers to the Five Questions

## 1. WSDL vs OpenAPI Line Count

The WSDL file from Assignment 3 (`partner.wsdl`) contains **72 lines**, while the OpenAPI file from Assignment 4 (`openapi.yaml`) contains **226 lines**. Therefore, OpenAPI contains **154 more lines**.

This difference is not evidence that REST is more complicated than SOAP. Assignment 3 describes the Payment Service, while Assignment 4 describes the Listing Service. Their requirements and contents differ, so the line count cannot be used as a direct comparison of the two technologies.

Two things declared in WSDL that OpenAPI does not express in the same form are:

1. **SOAP bindings:** WSDL specifies how abstract operations are connected to SOAP messages and communication protocols.
2. **Service and port declarations:** WSDL describes services and their ports, including how clients access the service. OpenAPI describes HTTP API endpoints and server URLs differently.

OpenAPI focuses on HTTP paths, methods, parameters, request bodies, responses, and schemas.

## 2. SOAP Fault vs REST Error Response

In Assignment 3, the Payment Service used a SOAP fault similar to the following:

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

The fault communicates that the payment was declined and provides additional error details.

In the Hostel PG Tracker Listing Service, a temporary owner-service outage produces **HTTP 503 Service Unavailable** with a JSON problem response:

```json
{
  "type": "https://errors.hostel-pg.example/503",
  "title": "Owner service unavailable",
  "status": 503,
  "detail": "Eligibility could not be checked; retry with the same Idempotency-Key."
}
```

These examples represent different failures: a declined payment and an unavailable dependency. The REST response uses an HTTP status code and a structured JSON body to communicate the failure.

Returning an error inside **HTTP 200 OK** is problematic because intermediaries, monitoring systems, caches, and clients may interpret the request as successful without inspecting the response body. Using an appropriate HTTP error status, such as 503, allows these systems to identify the failure and handle retries or report errors correctly.

## 3. UDDI Publish, Find, and Bind

The traditional SOAP service-discovery model uses three activities:

- **Publish:** A service provider registers service information in a UDDI registry.
- **Find:** A client searches the registry for a suitable service.
- **Bind:** The client obtains the service description and endpoint information required to communicate with the service.

In the modern REST setup, these activities still exist conceptually, but a dedicated UDDI registry is generally unnecessary.

- **Publish:** The API specification can be published in a repository, documentation portal, or API catalogue.
- **Find:** Developers discover the API through documentation, repositories, catalogues, or service-discovery tools.
- **Bind:** A client configures the API's base URL and follows the documented HTTP methods, paths, headers, and JSON formats.

Therefore, UDDI itself has disappeared from this typical REST workflow, but its discovery and access-related responsibilities have been taken over by API documentation, repositories, catalogues, configuration, and service-discovery tools.

## 4. Runtime Validation in Assignment 4

In SOAP-based development, an XML Schema can validate an XML message against the contract's structure and data types before the business operation processes it.

In Assignment 4, the OpenAPI schema documents the expected requests and responses, but it does not automatically validate incoming requests at runtime.

In the Hostel PG Tracker Listing Service, the **`validate()` function in `app.py`** carries out request validation. It checks the JSON body, required fields, unsupported fields, and field types and constraints.

Without this validation, malformed input could reach the business logic. For example, a request might omit the required `monthlyRent` field or provide `"monthlyRent": "7500"` as a string instead of an integer. The validation function rejects these requests with HTTP 400 rather than allowing invalid data to proceed.

## 5. When Would SOAP Be Preferred Over REST?

I would prefer a SOAP-based integration for a payment service when an enterprise or financial partner explicitly requires WS-Security message-level security.

The guarantee I would be buying is **message integrity and, with an appropriately configured digital signature, evidence of the message's origin**. A recipient can verify that signed message content has not been modified after signing. WS-Security can also support message-level encryption to protect confidentiality.

These guarantees depend on correct signature, encryption, certificate, key-management, and security-policy configuration; SOAP alone does not provide them automatically.

For the Hostel PG Tracker Listing Service, REST with OpenAPI remains a suitable choice because the service primarily creates, reads, and updates accommodation listings through HTTP and JSON. SOAP would add complexity without a demonstrated requirement for SOAP-specific enterprise security standards.