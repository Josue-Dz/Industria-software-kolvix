src/
│
├── api/
│   ├── axiosConfig.ts
│   ├── interceptors.ts
│   └── api.types.ts
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── logos/
│
├── components/
│   │
│   ├── ui/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Modal/
│   │   ├── Table/
│   │   ├── Badge/
│   │   ├── Card/
│   │   ├── Avatar/
│   │   └── index.ts
│   │
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── PageHeader.tsx
│   │
│   └── shared/
│       ├── EstadoBadge.tsx
│       ├── ConfirmDialog.tsx
│       ├── EmptyState.tsx
│       ├── LoadingSpinner.tsx
│       ├── Pagination.tsx
│       └── PhotoUploader.tsx
│
├── features/
│
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── auth.routes.tsx
│
│   ├── dashboard/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│
│   ├── empresa/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── types/
│
│   ├── clientes/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── types/
│
│   ├── ordenes/
│   │   ├── components/
│   │   │   ├── OrdenForm.tsx
│   │   │   ├── OrdenCard.tsx
│   │   │   ├── OrdenDetalle.tsx
│   │   │   ├── OrdenTimeline.tsx
│   │   │   ├── OrdenFiltros.tsx
│   │   │   └── CambioEstadoModal.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useOrdenes.ts
│   │   │   └── useOrdenDetalle.ts
│   │   │
│   │   ├── pages/
│   │   │   ├── OrdenesPage.tsx
│   │   │   ├── NuevaOrdenPage.tsx
│   │   │   └── OrdenDetallePage.tsx
│   │   │
│   │   ├── services/
│   │   │   └── ordenes.service.ts
│   │   │
│   │   ├── schemas/
│   │   │   └── orden.schema.ts
│   │   │
│   │   ├── types/
│   │   │   └── orden.types.ts
│   │   │
│   │   └── ordenes.routes.tsx
│
│   ├── evidencias/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── schemas/
│
│   ├── tecnicos/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── types/
│
│   ├── inventario/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── types/
│
│   ├── marketplace/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── types/
│
│   ├── reseñas/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│
│   ├── notificaciones/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│
│   └── configuracion/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── types/
│
├── hooks/
│   ├── useDebounce.ts
│   ├── usePagination.ts
│   ├── useLocalStorage.ts
│   └── useToast.ts
│
├── router/
│   ├── AppRouter.tsx
│   ├── PrivateRoute.tsx
│   ├── PublicRoute.tsx
│   └── routes.ts
│
├── store/
│   ├── authStore.ts
│   ├── tenantStore.ts
│   ├── notificationStore.ts
│   └── uiStore.ts
│
├── types/
│   ├── common.types.ts
│   ├── paginated.types.ts
│   └── response.types.ts
│
├── utils/
│   ├── formatDate.ts
│   ├── formatCurrency.ts
│   ├── validators.ts
│   ├── fileHelpers.ts
│   └── statusColor.ts
│
├── config/
│   ├── constants.ts
│   ├── env.ts
│   └── permissions.ts
│
├── App.tsx
└── main.tsx