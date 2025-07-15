# API

## Types

```ts
type ISODate = string
type ID = string

type DayStatus = 'working' | 'closed' | 'blocked'

interface Service {
  id: ID
  name: string
}

interface Master {
  id: ID
  name: string
  avatarUrl: string
  services: Service[]
}

type AppointmentStatus = 'new' | 'confirmed' | 'paid' | 'cancelled'
interface Appointment {
  id: ID
  customerName: string
  at: ISODate
  service: Service
  master: Master
  notes: string | null
  status: AppointmentStatus
}
```

## `GET /day-statuses`

### Query params:

- year _integer_ **required** Example: `2025`
- month _integer_ **required** Zero-indexed (January is 0). Example: `1`

### Response:

```ts
interface DayStatusesResponse {
  data: DayStatus[]
}
```

## `GET /appointments`

### Query params:

- since _date_ Example: `2019-01-01T00:00:00.000Z`
- until _date_ Example: `2019-01-01T00:00:00.000Z`
- serviceIds _id[]_ Example: `serviceIds=5d2c1d15-ad05-4e0e-b7d1-3cd0be0b7b2d&serviceIds=dfcf6df9-b57d-430c-a057-41569b491176`
- masterIds _id[]_ Example: `masterIds=5d2c1d15-ad05-4e0e-b7d1-3cd0be0b7b2d&masterIds=dfcf6df9-b57d-430c-a057-41569b491176`
- search _string_ Example: `John Doe`
- page _integer_ Example: `1`
- perPage _integer_ Example: `10`

### Response:

```ts
interface AppointmentsResponse {
  data: Appointment[]
  total: number
}
```

## `POST /appointments`

### Body:

```ts
interface CreateAppointmentRequest {
  at: ISODate
  serviceId: ID
  masterId: ID
  customerName: string
  notes?: string | null
  status: 'new' | 'confirmed' | 'paid'
}
```

### Response:

```ts
interface CreateAppointmentResponse {
  data: Appointment
}
```

## `GET /masters`

### Query params:

- search _string_ Example: `John Doe`
- page _integer_ Example: `1`
- perPage _integer_ Example: `10`

### Response:

```ts
interface MastersResponse {
  data: Master[]
  total: number
}
```

## `GET /services`

### Query params:

- search _string_ Example: `Hair Coloring`
- page _integer_ Example: `1`
- perPage _integer_ Example: `10`

### Response:

```ts
interface ServicesResponse {
  data: Service[]
  total: number
}
```
