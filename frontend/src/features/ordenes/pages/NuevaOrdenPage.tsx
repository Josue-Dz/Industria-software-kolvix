import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Plus, Upload, CheckCircle2, X } from 'lucide-react';

export const NuevaOrdenPage: React.FC = () => {
  const navigate = useNavigate();

  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [deviceType, setDeviceType] = useState('Celular');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('800');
  const [technician, setTechnician] = useState('-- Dejar sin asignar temporalmente --');
  const [issueDescription, setIssueDescription] = useState('');
  const [markType, setMarkType] = useState('Rotura / Crack');
  const [markNote, setMarkNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/ordenes');
  };

  return (
    <DashboardLayout
      title="Órdenes"
      subtitle=""
      role="admin"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Top Tabs matching Registro de ordenes.png */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/ordenes">
            <button style={{
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              backgroundColor: 'transparent',
              color: '#3730A3',
              border: 'none',
              cursor: 'pointer'
            }}>
              Lista de Órdenes
            </button>
          </Link>

          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 24px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '700',
            backgroundColor: '#EDE9FE',
            color: '#3730A3',
            border: 'none'
          }}>
            <Plus size={18} /> Registrar Nuevo Ingreso
          </button>
        </div>

        {/* Main Card Container */}
        <Card hoverable={false} style={{ padding: '32px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
          
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
              Registro Inteligente de Orden
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              Siga cada campo para digitalizar de inmediato el ingreso del cliente.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
              
              {/* Left Section: 1. Información Operativa y de Contacto */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                    1. Información Operativa y de Contacto
                  </h3>
                </div>

                <div className="grid-2">
                  <Input
                    label="NOMBRE DE CLIENTE *"
                    placeholder="Ej. Nohely Reyes"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                  <Input
                    label="TELÉFONO DE ENLACE *"
                    placeholder="Ej. +504 8956-3652"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="grid-3">
                  <div className="input-group">
                    <label className="input-label">TIPO DE DISPOSITIVO</label>
                    <select
                      className="input-field"
                      value={deviceType}
                      onChange={(e) => setDeviceType(e.target.value)}
                    >
                      <option value="Celular">Celular</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Consola">Consola</option>
                      <option value="Electrodoméstico">Electrodoméstico</option>
                    </select>
                  </div>

                  <Input
                    label="MARCA *"
                    placeholder="Ej. Samsung"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  />

                  <Input
                    label="MODELO *"
                    placeholder="Ej. Galaxy 23"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                  />
                </div>

                <div className="grid-2">
                  <Input
                    label="NÚMERO DE SERIE (OPCIONAL)"
                    placeholder="Escriba código de etiqueta"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                  />

                  <Input
                    label="MANO DE OBRA ESTIMADA"
                    placeholder="800"
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">ASIGNAR TÉCNICO RESPONSABLE</label>
                  <select
                    className="input-field"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                  >
                    <option value="-- Dejar sin asignar temporalmente --">-- Dejar sin asignar temporalmente --</option>
                    <option value="L. Soto">L. Soto</option>
                    <option value="J. Pérez">J. Pérez</option>
                    <option value="A. Rivas">A. Rivas</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">FALLO REPORTADO (DESCRIPCIÓN)</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Describa el fallo indicado por el cliente..."
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Right Section: 2. Evidencia Visual Antireclamos */}
              <div style={{
                backgroundColor: '#FAFAFD',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
                    2. Evidencia Visual Antireclamos
                  </h4>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '6px', lineHeight: 1.4 }}>
                    Haga click sobre el esquema de celular para fijar la ubicación exacta de golpes, rasguños o vidrios fracturados del equipo recibidos en recepción del cliente.
                  </p>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '12px', textTransform: 'uppercase' }}>TIPO DE MARCA:</label>
                  <select
                    className="input-field"
                    value={markType}
                    onChange={(e) => setMarkType(e.target.value)}
                  >
                    <option value="Rotura / Crack">Rotura / Crack</option>
                    <option value="Rasguño / Rayón">Rasguño / Rayón</option>
                    <option value="Golpe / Abolladura">Golpe / Abolladura</option>
                    <option value="Desgaste normal">Desgaste normal</option>
                  </select>
                </div>

                <Input
                  placeholder="Añadir nota a la marca (Ej. Camara frontal quebrada)"
                  value={markNote}
                  onChange={(e) => setMarkNote(e.target.value)}
                />

                <div style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '14px',
                  padding: '40px 16px',
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}>
                  <Upload size={32} color="#6366F1" />
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    Subir evidencia de las marcas del dispositivo al ser entregado al taller...
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                    Archivos compatibles: .jpg y .png
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Right Action Buttons matching Registro de ordenes.png */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/ordenes')}
                style={{ borderRadius: '12px', padding: '12px 24px', borderColor: '#3730A3', color: '#3730A3' }}
              >
                Cancelar registro
              </Button>

              <Button
                type="submit"
                variant="primary"
                style={{ backgroundColor: '#3730A3', borderRadius: '12px', padding: '12px 32px' }}
                icon={<CheckCircle2 size={18} />}
              >
                Generar ticket
              </Button>
            </div>

          </form>

        </Card>
      </div>
    </DashboardLayout>
  );
};
