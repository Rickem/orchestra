# Security and privacy checklist

Each project answers these in `docs/product/REQUIREMENTS.md` (non-functional section). "Not applicable" is a valid answer if a reason is given.

| Area | Question |
|---|---|
| Data classification | What data is handled, how sensitive is it, and is all of it needed? |
| Authentication | Who can sign in, and how? |
| Authorization | Who may do what? Is it enforced server-side and at the data layer? |
| Tenant isolation | Can one customer ever see another's data? |
| Secrets | Where do secrets live? Are they kept out of the repo, logs and client code? |
| Input and output | Is input validated and output encoded at every trust boundary? |
| File handling | Are uploads and downloads restricted by type, size and access? |
| Logging and retention | What is logged, for how long, and does it contain personal data? |
| Encryption | Is data encrypted in transit, and at rest where needed? |
| Dependencies | How are dependency and supply-chain risks tracked? |
| Backup and recovery | What is backed up, and has a restore been tested? |
| Regulation | Which privacy or industry rules may apply? |

Limits:

- Completing this checklist is not legal or regulatory compliance. Flag where qualified legal, privacy or security review is needed.
- A review of a change is not a full security audit; say what was and was not examined.
