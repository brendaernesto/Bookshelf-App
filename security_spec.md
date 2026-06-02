# Security Specification for Bookshelf App

## Data Invariants
1. `BookQuote` documents inside `/users/{userId}/quotes/{quoteId}` must belong exclusively to the authenticated user owning the `{userId}` container path.
2. The `userId` inside the `BookQuote` document must strictly match the authenticated user `request.auth.uid`.
3. Document fields must match key specifications and lengths to prevent resource/wallet exhaustion.

## Testing Payloads
1. **Unauthenticated Quote Create**: Trying to write a quote without a valid session. Expect: `PERMISSION_DENIED`.
2. **Identity Spoofing Quote Create**: Trying to write a quote with another user's `userId`. Expect: `PERMISSION_DENIED`.
3. **Cross-Tenant Write / Read**: Trying to write or read a quote under another user's `{userId}` hierarchy. Expect: `PERMISSION_DENIED`.
4. **Invalid Field Types / Oversized Payload**: Trying to inject very large strings or wrong types. Expect: `PERMISSION_DENIED`.
