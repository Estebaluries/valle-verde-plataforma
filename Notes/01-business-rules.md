# Business Rules

This document defines the business rules and constraints that govern the project.
# Business Rules – Inmobiliaria Valle Verde

## Listings
- A property must include: title, price, location, status, agent.
- Only admins can publish or unpublish listings.
- Properties must have at least 5 images.

## Agents
- Agents can only edit their assigned properties.
- Agents must log follow-ups for every client interaction.
- Commissions are calculated based on property type and sale price.

## Clients
- Clients must confirm appointments via email/SMS.
- Clients can request visits for multiple properties.

## CRM
- Lead statuses: New, Contacted, In Progress, Closed, Lost.
- Every lead must be assigned to an agent within 24 hours.

## Payments
- Payments must be validated manually by an admin.
- Payment receipts must be stored for auditing.

## Security
- Admins have full access.
- Agents have restricted access.
- Clients only access their own data.