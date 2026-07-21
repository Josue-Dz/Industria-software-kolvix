import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { 
  ArrowLeft, 
  User, 
  Wrench, 
  Calendar, 
  Download, 
  MessageSquare, 
  Mail, 
  CheckCircle, 
  XCircle,
  Info,
  Stethoscope,
  FileText,
  Camera,
  Upload,
  ArrowRight,
  Plus,
  Search,
  Package,
  X,
  Trash2
} from 'lucide-react';

export const DetalleOrdenPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'diag' | 'cot' | 'evi'>('cot');
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');

  const availableInventory = [
    { sku: 'REP-001', name: 'Pantalla LCD Retina 14', category: 'Pantallas', price: 'L. 500', stock: 12 },
    { sku: 'REP-002', name: 'Batería compatible MacBook Pro', category: 'Batería', price: 'L. 1500', stock: 8 },
    { sku: 'REP-003', name: 'Flex de carga USB-C', category: 'Flex', price: 'L. 800', stock: 10 },
    { sku: 'REP-004', name: 'Teclado MacBook Pro 14', category: 'Teclados', price: 'L. 1200', stock: 5 },
    { sku: 'REP-005', name: 'Pantalla OLED iPhone 14 Pro', category: 'Pantallas', price: 'L. 1600', stock: 6 },
    { sku: 'REP-006', name: 'Cargador Dell 65W', category: 'Cargadores', price: 'L. 900', stock: 15 },
    { sku: 'REP-007', name: 'Pasta térmica Artic MX-6', category: 'Consumibles', price: 'L. 500', stock: 25 },
    { sku: 'REP-008', name: 'Bisel posterior iPad Air', category: 'Carcasas', price: 'L. 1350', stock: 4 },
    { sku: 'REP-009', name: 'Disco SSD 512GB Nvme', category: 'Almacenamiento', price: 'L. 3500', stock: 7 },
    { sku: 'REP-010', name: 'Cable HDMI 4K 2m', category: 'Cables', price: 'L. 500', stock: 30 }
  ];

  const [assignedParts, setAssignedParts] = useState([
    { sku: 'REP-003', name: 'Flex de carga USB-C', category: 'Flex', price: 'L. 800', qty: 1, stock: '10 disponibles' }
  ]);

  const handleSelectPart = (part: any) => {
    if (!assignedParts.find(p => p.sku === part.sku)) {
      setAssignedParts(prev => [...prev, {
        sku: part.sku,
        name: part.name,
        category: part.category,
        price: part.price,
        qty: 1,
        stock: `${part.stock} disponibles`
      }]);
    }
    setIsInventoryModalOpen(false);
  };

  const handleRemoveAssignedPart = (sku: string) => {
    setAssignedParts(prev => prev.filter(p => p.sku !== sku));
  };

  const filteredInventory = availableInventory.filter(item =>
    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.category.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Órdenes"
      subtitle=""
      role="admin"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
        
        {/* Ticket Header Banner matching Dashboard de ordenes.png */}
        <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B' }}>OBK-2026-N456</span>
                <span className="badge badge-purple" style={{ backgroundColor: '#EDE9FE', color: '#3730A3' }}>
                  • En reparación
                </span>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#3730A3', marginBottom: '12px' }}>
                Samsung Galaxy S23
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} color="#6366F1" /> <span>Ronny</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wrench size={16} color="#6366F1" /> <span>L.Soto</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} color="#6366F1" /> <span>Ingreso: 07 Enero</span>
                </div>
              </div>
            </div>

            <Link to="/ordenes" style={{ color: '#3730A3' }}>
              <ArrowLeft size={24} />
            </Link>
          </div>
        </Card>

        {/* Sub Navigation Bar */}
        <Card hoverable={false} style={{ padding: '8px 16px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setActiveSubTab('info')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                backgroundColor: activeSubTab === 'info' ? '#EDE9FE' : 'transparent',
                color: activeSubTab === 'info' ? '#3730A3' : '#64748B',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Info size={18} /> Información
            </button>

            <button
              onClick={() => setActiveSubTab('diag')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                backgroundColor: activeSubTab === 'diag' ? '#EDE9FE' : 'transparent',
                color: activeSubTab === 'diag' ? '#3730A3' : '#64748B',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Stethoscope size={18} /> Diagnóstico
            </button>

            <button
              onClick={() => setActiveSubTab('cot')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                backgroundColor: activeSubTab === 'cot' ? '#EDE9FE' : 'transparent',
                color: activeSubTab === 'cot' ? '#3730A3' : '#64748B',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <FileText size={18} /> Cotización
            </button>

            <button
              onClick={() => setActiveSubTab('evi')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                backgroundColor: activeSubTab === 'evi' ? '#EDE9FE' : 'transparent',
                color: activeSubTab === 'evi' ? '#3730A3' : '#64748B',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Camera size={18} /> Evidencia
            </button>
          </div>
        </Card>

        {/* Main Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '24px' }}>
          
          {/* Left Dynamic Tab Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 1. INFORMACIÓN TAB CONTENT */}
            {activeSubTab === 'info' && (
              <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                  Detalles Generales del Ticket
                </h3>

                <div className="grid-2">
                  <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>CLIENTE</span>
                    <strong style={{ fontSize: '15px', color: '#1E1B4B' }}>Ronny</strong>
                    <span style={{ fontSize: '13px', color: '#64748B', display: 'block' }}>+504 9931-2550</span>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>DISPOSITIVO</span>
                    <strong style={{ fontSize: '15px', color: '#1E1B4B' }}>Samsung Galaxy S23</strong>
                    <span style={{ fontSize: '13px', color: '#64748B', display: 'block' }}>S/N: DNPGD703JQH</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>DAÑO REPORTADO</span>
                  <p style={{ fontSize: '14px', color: '#475569', fontStyle: 'italic', margin: 0 }}>
                    "El teléfono no enciende al conectar el cargador y la batería se descarga muy rápido. Pantalla sin rajaduras aparentes."
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginBottom: '12px' }}>
                    Estructura de precios:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Precio Diagnóstico Base:</span>
                      <strong style={{ color: '#1E1B4B' }}>L. 200</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Costo de Repuestos Consumidos:</span>
                      <strong style={{ color: '#1E1B4B' }}>L. 800</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Costo de mano de Obra / Reparación:</span>
                      <strong style={{ color: '#1E1B4B' }}>L. 250</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '800', color: '#3730A3', borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
                      <span>Monto total a liquidar (con cotización aprobada):</span>
                      <span>L. 1,250</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <Button variant="primary" style={{ backgroundColor: '#3730A3' }}>
                    Listo para entregar
                  </Button>
                </div>
              </Card>
            )}

            {/* 2. DIAGNÓSTICO TAB CONTENT matching Diagnostico de ordenes.png */}
            {activeSubTab === 'diag' && (
              <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                    Diagnóstico Técnico
                  </h3>
                  <span style={{ fontSize: '13px', color: '#6366F1', fontWeight: '600' }}>
                    OBK-2026-N456 · Ronny · Samsung Galaxy S23
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px' }}>
                  
                  {/* Hallazgos del técnico */}
                  <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B' }}>Hallazgos del técnico</span>

                    <Input label="Problema encontrado" placeholder="Ej. El equipo no enciende, no carga al conectar..." defaultValue="Centro de carga pin sulfatado y flex de carga intermitente." />
                    <Input label="Causa Raíz" placeholder="Ej. Conector USB-C dañado por uso excesivo..." defaultValue="Conector USB-C sulfatado por humedad previa." />

                    <div className="grid-2">
                      <Input label="Tiempo estimado de reparación" defaultValue="2 días hábiles" />
                      <div className="input-group">
                        <label className="input-label">Nivel de complejidad</label>
                        <select className="input-field" defaultValue="Media">
                          <option>Baja</option>
                          <option>Media</option>
                          <option>Alta</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Observaciones adicionales</label>
                      <textarea className="input-field" rows={2} defaultValue="Se recomienda cambio preventivo de flex USB-C completo." />
                    </div>
                  </div>

                  {/* Resumen Económico + SLA */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B', display: 'block', marginBottom: '12px' }}>
                        Resumen Económico
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                          <span>Repuestos</span>
                          <strong>L. 800</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                          <span>Mano de obra</span>
                          <strong>L. 250</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                          <span>Diagnóstico</span>
                          <strong>L. 200</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '800', color: '#1E1B4B', borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
                          <span>Total estimado</span>
                          <span>L. 1250</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#EDE9FE', padding: '14px', borderRadius: '12px', fontSize: '12px', color: '#3730A3' }}>
                      <strong>⏱ SLA:</strong> Una vez aprobada la cotización, la reparación inicia en menos de 4 horas hábiles.
                    </div>
                  </div>

                </div>

                {/* Repuestos Requeridos Box */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B', display: 'block' }}>
                        Repuestos requeridos
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>Selecciona directamente del inventario del taller</span>
                    </div>

                    <button
                      onClick={() => setIsInventoryModalOpen(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '700',
                        backgroundColor: '#3730A3',
                        color: '#FFFFFF',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={16} /> Agregar Repuesto
                    </button>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#EDE9FE', color: '#3730A3' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>REPUESTO</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>SKU</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center' }}>CANT.</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>STOCK</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>PRECIO</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedParts.map((p) => (
                        <tr key={p.sku} style={{ borderBottom: '1px solid #E2E8F0' }}>
                          <td style={{ padding: '10px 12px', fontWeight: '600' }}>{p.name}</td>
                          <td style={{ padding: '10px 12px', color: '#64748B' }}>{p.sku}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>{p.qty}</td>
                          <td style={{ padding: '10px 12px', color: '#10B981', fontWeight: '600' }}>{p.stock}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '700' }}>{p.price}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <button
                              onClick={() => handleRemoveAssignedPart(p.sku)}
                              style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <Button variant="outline">Guardar borrador</Button>
                  <Button variant="primary" style={{ backgroundColor: '#3730A3' }}>Generar cotización</Button>
                </div>
              </Card>
            )}

            {/* 3. COTIZACIÓN TAB CONTENT */}
            {activeSubTab === 'cot' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                      Cotización COT-2041
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                      Propuesta comercial • Ronny • 07 Enero 2026
                    </p>
                  </div>

                  <Button variant="outline" size="sm" icon={<Download size={16} />}>
                    Descargar PDF
                  </Button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                  
                  {/* Quote Invoice Card */}
                  <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0', marginBottom: '16px' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>COTIZACIÓN</span>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B' }}>COT-2041</span>
                        <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Válida hasta el 14 Jun 2026</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#3730A3' }}>TechFix</span>
                        <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>RTN 0801-1985-001122</span>
                        <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Col. Las Americas</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '13px' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>CLIENTE</span>
                        <strong style={{ color: '#1E1B4B' }}>Ronny</strong>
                        <span style={{ color: '#64748B', display: 'block' }}>ronny526@gmail.com</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block' }}>EQUIPO</span>
                        <strong style={{ color: '#1E1B4B' }}>Samsung Galaxy S23</strong>
                        <span style={{ color: '#64748B', display: 'block' }}>Serie:DNPGD703JQH</span>
                      </div>
                    </div>

                    {/* Items Table */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '20px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F8FAFC', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>
                          <th style={{ padding: '8px', textAlign: 'left' }}>REPUESTO</th>
                          <th style={{ padding: '8px', textAlign: 'center' }}>CANT.</th>
                          <th style={{ padding: '8px', textAlign: 'right' }}>PRECIO</th>
                          <th style={{ padding: '8px', textAlign: 'right' }}>SUBTOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '8px', fontWeight: '600' }}>Flex de carga USB-C</td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>1</td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>L. 800</td>
                          <td style={{ padding: '8px', textAlign: 'right', fontWeight: '700' }}>L. 800</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '8px', fontWeight: '600' }}>Batería original 500 mAh</td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>1</td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>L. 600</td>
                          <td style={{ padding: '8px', textAlign: 'right', fontWeight: '700' }}>L. 600</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '8px', fontWeight: '600' }}>Pasta térmica premium</td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>1</td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>L. 450</td>
                          <td style={{ padding: '8px', textAlign: 'right', fontWeight: '700' }}>L. 450</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px', fontWeight: '600' }}>Tornillera Pentalobe</td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>8</td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>L. 30</td>
                          <td style={{ padding: '8px', textAlign: 'right', fontWeight: '700' }}>L. 240</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Subtotals & Total */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right', fontSize: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                        <span>Subtotal repuestos</span>
                        <span>L. 2090</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                        <span>Mano de obra</span>
                        <span>L. 150</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                        <span>Impuestos (15%)</span>
                        <span>L. 50</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '800', color: '#1E1B4B', marginTop: '6px' }}>
                        <span>TOTAL</span>
                        <span>L. 2260</span>
                      </div>
                    </div>

                    {/* Terms Note */}
                    <div style={{ backgroundColor: '#EDE9FE', borderRadius: '10px', padding: '10px 14px', marginTop: '16px', fontSize: '11px', color: '#3730A3' }}>
                      <strong>Términos:</strong> Garantía de 90 días sobre los repuestos instalados. La aprobación de esta cotización autoriza al taller a iniciar las reparaciones descritas.
                    </div>
                  </Card>

                  {/* Status and Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Quote Status Box */}
                    <Card hoverable={false} style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#FFFFFF' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E1B4B', display: 'block', marginBottom: '8px' }}>
                        Estado de la cotización
                      </span>
                      <div style={{ backgroundColor: '#EDE9FE', padding: '10px 14px', borderRadius: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#3730A3', display: 'block' }}>Aprobado</span>
                        <span style={{ fontSize: '11px', color: '#6366F1' }}>Enviado al cliente hace 7 días</span>
                      </div>
                    </Card>

                    {/* Send to Client Box */}
                    <Card hoverable={false} style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E1B4B' }}>
                        Enviar al cliente
                      </span>
                      <Button variant="outline" size="sm" icon={<MessageSquare size={16} />} style={{ width: '100%', borderRadius: '10px' }}>
                        Enviar por whatsapp
                      </Button>
                      <Button variant="outline" size="sm" icon={<Mail size={16} />} style={{ width: '100%', borderRadius: '10px' }}>
                        Enviar por correo
                      </Button>
                    </Card>

                    {/* Manual Decision Box */}
                    <Card hoverable={false} style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E1B4B' }}>
                        Decisión manual
                      </span>
                      <Button variant="primary" size="sm" style={{ width: '100%', backgroundColor: '#3730A3', borderRadius: '10px' }} icon={<CheckCircle size={16} />}>
                        Generar ticket
                      </Button>
                      <Button variant="outline" size="sm" style={{ width: '100%', color: '#EF4444', borderColor: '#FCA5A5', borderRadius: '10px' }} icon={<XCircle size={16} />}>
                        Marcar como rechazada
                      </Button>
                    </Card>

                  </div>
                </div>
              </>
            )}

            {/* 4. EVIDENCIA TAB CONTENT */}
            {activeSubTab === 'evi' && (
              <Card hoverable={false} style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Comparador antes vs despues */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                        Comparador antes vs despues
                      </h3>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Evidencia visual del cambio realizado</span>
                    </div>

                    <Button variant="outline" size="sm" icon={<Camera size={16} />}>
                      Agregar foto
                    </Button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: '16px', alignItems: 'center' }}>
                    <div style={{ border: '1px dashed #A78BFA', borderRadius: '14px', height: '160px', backgroundColor: '#FAFAFD', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                      <Upload size={28} color="#6366F1" style={{ marginBottom: '8px' }} />
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#1E1B4B' }}>ANTES</span>
                      <span style={{ fontSize: '11px' }}>Archivos compatibles: .jpg y .png</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <ArrowRight size={24} color="#6366F1" />
                    </div>

                    <div style={{ border: '1px dashed #A78BFA', borderRadius: '14px', height: '160px', backgroundColor: '#FAFAFD', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                      <Upload size={28} color="#6366F1" style={{ marginBottom: '8px' }} />
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#1E1B4B' }}>DESPUÉS</span>
                      <span style={{ fontSize: '11px' }}>Archivos compatibles: .jpg y .png</span>
                    </div>
                  </div>
                </div>

                {/* Ingreso slots */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                        Ingreso
                      </h3>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Estado del equipo al momento de la recepción</span>
                    </div>

                    <Button variant="outline" size="sm" icon={<Camera size={16} />}>
                      Agregar foto
                    </Button>
                  </div>

                  <div className="grid-4">
                    {['Frontal', 'Posterior', 'Lado Izquierda', 'Lateral derecho'].map((pos) => (
                      <div key={pos} style={{ border: '1px dashed #CBD5E1', borderRadius: '14px', height: '120px', backgroundColor: '#FAFAFD', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Camera size={22} color="#64748B" />
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>{pos}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </Card>
            )}

          </div>

          {/* Right Column: Flujo Operativo Timeline matching Dashboard de ordenes.png */}
          <Card hoverable={false} style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', marginBottom: '24px' }}>
              Flujo Operativo
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
              
              {/* Step 1: Ingresado */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#A78BFA', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  <CheckCircle size={20} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#3730A3' }}>Ingresado</span>
              </div>

              {/* Step 2: Asignado */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#A78BFA', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  <CheckCircle size={20} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#3730A3' }}>Asignado</span>
              </div>

              {/* Step 3: Diagnóstico */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#A78BFA', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  <CheckCircle size={20} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#3730A3' }}>Diagnóstico</span>
              </div>

              {/* Step 4: Cotización */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#A78BFA', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  <CheckCircle size={20} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#3730A3' }}>Cotización</span>
              </div>

              {/* Step 5: Aprobación del cliente */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#A78BFA', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  <CheckCircle size={20} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#3730A3' }}>Aprobación del cliente</span>
              </div>

              {/* Step 6: Reparación (Active Step) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1E1B4B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  6
                </div>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B' }}>Reparación</span>
              </div>

              {/* Step 7: Entrega */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: 0.5 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#EDE9FE', color: '#3730A3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  7
                </div>
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#64748B' }}>Entrega</span>
              </div>

            </div>
          </Card>

        </div>

        {/* INVENTARIO DEL TALLER MODAL matching Requisitos requeridos de diagnostico de ordenes.png 100% */}
        {isInventoryModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}>
            <Card hoverable={false} style={{ width: '100%', maxWidth: '580px', padding: '24px', borderRadius: '20px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                    Inventario del Taller
                  </h3>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>
                    Selecciona un repuesto para asignarlo a la orden
                  </span>
                </div>
                <button
                  onClick={() => setIsInventoryModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Search Bar */}
              <Input
                placeholder="Buscar por nombre, SKU o categoría..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                icon={<Search size={18} />}
              />

              {/* Parts List matching Requisitos requeridos de diagnostico de ordenes.png */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                {filteredInventory.map((item) => (
                  <div
                    key={item.sku}
                    onClick={() => handleSelectPart(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    className="card-hover"
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#EDE9FE',
                      color: '#3730A3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Package size={20} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#1E1B4B', display: 'block' }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>
                        {item.sku} · {item.category} · <strong style={{ color: '#3730A3' }}>{item.price}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </Card>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
