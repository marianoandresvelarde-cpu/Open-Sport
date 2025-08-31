# Football Token API Documentation

## Base URL
```
http://localhost:3000
```

---

## Endpoints

### 1. Health Check

**GET** `/`

Verifica que el servidor esté funcionando correctamente.

#### Request
- **Método**: `GET`
- **URL**: `/`
- **Headers**: Ninguno requerido
- **Body**: Ninguno

#### Response
```json
"Hello World!"
```

**Status Codes:**
- `200 OK`: Servidor funcionando correctamente

---

## Football Token Endpoints

### 2. Deploy Football Token Contract

**POST** `/football_token/deploy`

Despliega un nuevo contrato de Football Token en la blockchain.

#### Request
- **Método**: `POST`
- **URL**: `/football_token/deploy`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "playerWallet": "0x1234567890123456789012345678901234567890",
    "platformWallet": "0x0987654321098765432109876543210987654321",
    "name": "Messi Token",
    "symbol": "MESSI"
  }
  ```

#### Body Parameters
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `playerWallet` | string | ✅ | Dirección wallet del jugador (recibirá 75% de tokens) |
| `platformWallet` | string | ✅ | Dirección wallet de la plataforma (recibirá 1% de tokens) |
| `name` | string | ✅ | Nombre del token (ej: "Messi Token") |
| `symbol` | string | ✅ | Símbolo del token (ej: "MESSI") |

#### Response
```json
{
  "contractAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Response Fields
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `contractAddress` | string | Dirección del contrato desplegado en blockchain |
| `id` | string | ID único del contrato en la base de datos |

**Status Codes:**
- `201 Created`: Contrato desplegado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `500 Internal Server Error`: Error en el despliegue

#### Token Distribution
Al desplegarse el contrato, los tokens se distribuyen automáticamente:
- **1%** → Wallet de la plataforma (ingresos del holding)
- **24%** → Contrato (disponible para venta a usuarios)
- **75%** → Wallet del jugador (propiedad directa)

**Supply total**: 100,000,000 tokens

---

### 3. Get All Contracts

**GET** `/football_token`

Obtiene todos los contratos de Football Token desplegados.

#### Request
- **Método**: `GET`
- **URL**: `/football_token`
- **Headers**: Ninguno requerido
- **Body**: Ninguno

#### Response
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "playerWallet": "0x1234567890123456789012345678901234567890",
    "platformWallet": "0x0987654321098765432109876543210987654321",
    "name": "Messi Token",
    "symbol": "MESSI",
    "contractAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
    "deployedAt": "2025-08-30T18:30:45.123Z"
  },
  {
    "id": "660f9511-f3ac-52e5-b827-557766551111",
    "playerWallet": "0x2345678901234567890123456789012345678901",
    "platformWallet": "0x0987654321098765432109876543210987654321",
    "name": "Ronaldo Token",
    "symbol": "CR7",
    "contractAddress": "0xbcdef01234567890abcdef1234567890abcdef123",
    "deployedAt": "2025-08-30T19:15:30.456Z"
  }
]
```

#### Response Fields
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | ID único del contrato |
| `playerWallet` | string | Dirección wallet del jugador |
| `platformWallet` | string | Dirección wallet de la plataforma |
| `name` | string | Nombre del token |
| `symbol` | string | Símbolo del token |
| `contractAddress` | string | Dirección del contrato en blockchain |
| `deployedAt` | string | Fecha y hora de despliegue (ISO 8601) |

**Status Codes:**
- `200 OK`: Lista obtenida exitosamente
- `500 Internal Server Error`: Error interno del servidor

---

### 4. Get Contract by ID

**GET** `/football_token/{id}`

Obtiene un contrato específico por su ID.

#### Request
- **Método**: `GET`
- **URL**: `/football_token/{id}`
- **Headers**: Ninguno requerido
- **Body**: Ninguno

#### URL Parameters
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | ✅ | ID único del contrato |

#### Response - Contrato encontrado
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "playerWallet": "0x1234567890123456789012345678901234567890",
  "platformWallet": "0x0987654321098765432109876543210987654321",
  "name": "Messi Token",
  "symbol": "MESSI",
  "contractAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
  "deployedAt": "2025-08-30T18:30:45.123Z"
}
```

#### Response - Contrato no encontrado
```json
null
```

**Status Codes:**
- `200 OK`: Contrato encontrado o no encontrado (retorna null)
- `500 Internal Server Error`: Error interno del servidor

---

## Goal Management Endpoints

### 5. Create Goal

**POST** `/football_token/{contractId}/goals`

Crea una nueva meta de recaudación para un contrato específico.

#### Request
- **Método**: `POST`
- **URL**: `/football_token/{contractId}/goals`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "targetAmount": 1000.00
  }
  ```

#### URL Parameters
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `contractId` | string | ✅ | ID único del contrato |

#### Body Parameters
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `targetAmount` | number | ✅ | Meta de recaudación en USD (ej: 1000.00) |

#### Response
```json
{
  "goalId": "0",
  "transactionHash": "0x123456789abcdef..."
}
```

**Status Codes:**
- `201 Created`: Meta creada exitosamente
- `400 Bad Request`: Datos inválidos
- `404 Not Found`: Contrato no encontrado

---

### 6. Add Funds to Goal

**PUT** `/football_token/{contractId}/goals/{goalId}/add-funds`

Registra fondos recaudados para una meta específica. Cuando se alcanza la meta, automáticamente distribuye los fondos (8% plataforma, 92% jugador).

#### Request
- **Método**: `PUT`
- **URL**: `/football_token/{contractId}/goals/{goalId}/add-funds`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "amount": 250.50
  }
  ```

#### URL Parameters
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `contractId` | string | ✅ | ID único del contrato |
| `goalId` | string | ✅ | ID de la meta |

#### Body Parameters
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `amount` | number | ✅ | Cantidad a agregar en USD (ej: 250.50) |

#### Response
```json
{
  "transactionHash": "0x123456789abcdef...",
  "goalCompleted": true
}
```

#### Response Fields
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `transactionHash` | string | Hash de la transacción en blockchain |
| `goalCompleted` | boolean | Indica si la meta se completó con esta adición |

**Status Codes:**
- `200 OK`: Fondos agregados exitosamente
- `400 Bad Request`: Datos inválidos o meta ya completada
- `404 Not Found`: Contrato o meta no encontrada

---

### 7. Get Goal Details

**GET** `/football_token/{contractId}/goals/{goalId}`

Obtiene información detallada de una meta específica.

#### Request
- **Método**: `GET`
- **URL**: `/football_token/{contractId}/goals/{goalId}`

#### URL Parameters
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `contractId` | string | ✅ | ID único del contrato |
| `goalId` | string | ✅ | ID de la meta |

#### Response
```json
{
  "goalId": "0",
  "targetAmount": 1000.00,
  "raisedAmount": 750.25,
  "completed": false,
  "completedAt": null
}
```

#### Response Fields
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `goalId` | string | ID de la meta |
| `targetAmount` | number | Meta objetivo en USD |
| `raisedAmount` | number | Cantidad recaudada hasta el momento |
| `completed` | boolean | Si la meta está completada |
| `completedAt` | string\|null | Fecha de finalización (ISO 8601) o null |

**Status Codes:**
- `200 OK`: Meta encontrada
- `404 Not Found`: Contrato o meta no encontrada

---

### 8. Get Goal Progress

**GET** `/football_token/{contractId}/goals/{goalId}/progress`

Obtiene el progreso porcentual de una meta.

#### Request
- **Método**: `GET`
- **URL**: `/football_token/{contractId}/goals/{goalId}/progress`

#### URL Parameters
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `contractId` | string | ✅ | ID único del contrato |
| `goalId` | string | ✅ | ID de la meta |

#### Response
```json
{
  "goalId": "0",
  "progressPercentage": 75.03
}
```

#### Response Fields
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `goalId` | string | ID de la meta |
| `progressPercentage` | number | Porcentaje de progreso (0-100) |

**Status Codes:**
- `200 OK`: Progreso calculado exitosamente
- `404 Not Found`: Contrato o meta no encontrada

---

### 9. Get All Goals for Contract

**GET** `/football_token/{contractId}/goals`

Obtiene todas las metas de un contrato con su progreso.

#### Request
- **Método**: `GET`
- **URL**: `/football_token/{contractId}/goals`

#### URL Parameters
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `contractId` | string | ✅ | ID único del contrato |

#### Response
```json
[
  {
    "goalId": "0",
    "targetAmount": 1000.00,
    "raisedAmount": 1000.00,
    "completed": true,
    "completedAt": "2025-08-30T19:45:30.123Z",
    "progressPercentage": 100.00
  },
  {
    "goalId": "1",
    "targetAmount": 2500.00,
    "raisedAmount": 1875.50,
    "completed": false,
    "completedAt": null,
    "progressPercentage": 75.02
  }
]
```

**Status Codes:**
- `200 OK`: Lista obtenida exitosamente
- `404 Not Found`: Contrato no encontrado

---

## Goal Distribution Logic

### Automatic Distribution
Cuando una meta se completa (cantidad recaudada ≥ meta objetivo):

1. **8%** va automáticamente a la wallet de la plataforma
2. **92%** va automáticamente a la wallet del jugador
3. Se emiten eventos en blockchain para tracking
4. La meta se marca como completada con timestamp

### Example Calculation
Meta: $1,000 USD
- Plataforma recibe: $80 (8%)
- Jugador recibe: $920 (92%)

---

Todos los endpoints pueden retornar errores en el siguiente formato:

```json
{
  "statusCode": 400,
  "message": "Descripción del error",
  "error": "Bad Request"
}
```

### Common Error Status Codes
- `400 Bad Request`: Datos de entrada inválidos
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error interno del servidor

---

## Examples

### Deploy a Messi Token
```bash
curl -X POST http://localhost:3000/football_token/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "playerWallet": "0x742d35Cc6075C2532C256e77000000000000000",
    "platformWallet": "0x8ba1f109551bD432803012645Hac136c777CC5e",
    "name": "Lionel Messi Token",
    "symbol": "MESSI"
  }'
```

### Get all contracts
```bash
curl -X GET http://localhost:3000/football_token
```

### Get specific contract
```bash
curl -X GET http://localhost:3000/football_token/550e8400-e29b-41d4-a716-446655440000
```

### Create a new goal
```bash
curl -X POST http://localhost:3000/football_token/550e8400-e29b-41d4-a716-446655440000/goals \
  -H "Content-Type: application/json" \
  -d '{
    "targetAmount": 1000.00
  }'
```

### Add funds to a goal
```bash
curl -X PUT http://localhost:3000/football_token/550e8400-e29b-41d4-a716-446655440000/goals/0/add-funds \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 250.50
  }'
```

### Get goal details
```bash
curl -X GET http://localhost:3000/football_token/550e8400-e29b-41d4-a716-446655440000/goals/0
```

### Get goal progress
```bash
curl -X GET http://localhost:3000/football_token/550e8400-e29b-41d4-a716-446655440000/goals/0/progress
```

### Get all goals for a contract
```bash
curl -X GET http://localhost:3000/football_token/550e8400-e29b-41d4-a716-446655440000/goals
```

---

## Notes

- Todos los contratos se despliegan en **Moonbase Alpha Testnet**
- El supply total es fijo: **100,000,000 tokens**
- La distribución de tokens es automática al momento del deploy
- Los endpoints utilizan **NestJS** como framework backend
- La base de datos es **LowDB** (archivo JSON local)

### Goal Management
- Las metas se almacenan en **blockchain** (inmutable)
- Los montos se manejan en **USD con 2 decimales** internamente
- La distribución al completar metas es **automática**: 8% plataforma, 92% jugador
- Se emiten **eventos de blockchain** para tracking completo
- Las metas completadas no pueden modificarse
- El progreso se calcula en tiempo real desde blockchain

### Security & Permissions
- Solo el **owner del contrato** puede crear metas y agregar fondos
- Las transacciones requieren **gas fees** en Moonbase Alpha
- Todas las operaciones de metas están **auditables** en blockchain
