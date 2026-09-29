# Óxido — Tienda de cosméticos para Rust
Tienda ficticia de cosméticos para el videojuego **Rust**. Permite explorar un catálogo de armas, ropa y herramientas, armar un carrito de compra, generar pedidos y hacerles seguimiento según el rol del usuario dentro de la organización.

Este proyecto es el desarrollo del caso semestral basado en una arquitectura **100% serverless**

## ¿Qué hace la aplicación?

- **Catálogo público**: cualquier visitante puede ver los productos disponibles por categoría, sin necesidad de iniciar sesión.
- **Autenticación corporativa**: el login se realiza con una identidad centralizada (Microsoft Entra ID), no con usuario y contraseña propios.
- **Roles diferenciados**: Admin, Operador, Cliente y Auditor, cada uno con su propio dashboard y permisos.
- **Gestión de pedidos**: un Cliente arma su carrito y genera un pedido; un Operador lo acepta, prepara, despacha y entrega, siguiendo una máquina de estados que no permite saltarse pasos (por ejemplo, no se puede despachar un pedido que no fue aceptado).
- **Control de stock**: el inventario de cada producto se descuenta automáticamente al aceptar un pedido, y se repone si el pedido se cancela después.
- **Reportería**: panel de KPIs para el Admin con ventas por hora, tiempo promedio de entrega (lead time), pedidos por estado y productos más vendidos.

## Arquitectura general

```
React (frontend, en localhost)
        │
        │  Login con Microsoft Entra ID → obtiene un token (JWT)
        ▼
Amazon API Gateway (valida el token en cada llamada)
        │
        ▼
Funciones AWS Lambda (una por responsabilidad de negocio)
        │
        ▼
Amazon DynamoDB (almacenamiento de datos)
```

El frontend corre en el computador local durante el desarrollo. Todo el backend vive en AWS, sin servidores propios que administrar: cada pieza se ejecuta solo cuando alguien la usa.

## Tecnologías y servicios utilizados

**Frontend**
- React + Vite
- MSAL (Microsoft Authentication Library) para el login con Entra ID

**Identidad**
- Microsoft Entra ID como proveedor de identidad (IDaaS), con roles de aplicación (App Roles) para distinguir Admin, Operador, Cliente y Auditor

**Backend**
- AWS Lambda (Node.js) para toda la lógica de negocio, sin servidores propios
- Amazon API Gateway como punto de entrada de la API, validando el token de Entra ID en cada solicitud protegida
- Amazon DynamoDB como base de datos, en modo de capacidad bajo demanda

## Estado del proyecto

- Autenticación y roles
- Catálogo de productos
- Gestión de pedidos y control de stock
- Reportería y KPIs