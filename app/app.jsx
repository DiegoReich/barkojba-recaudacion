'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xhqxzvwtwdsfoffnplhk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_oawJdtehC48I1Jok1CmYHA_zVBm1y9j';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function BarkojbaApp() {
  const [players, setPlayers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [teamConfig, setTeamConfig] = useState(null);
  const [isTesorero, setIsTesorero] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    player_id: '',
    month: '03',
    amount: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [playersRes, paymentsRes, configRes] = await Promise.all([
        supabase.from('players').select('*'),
        supabase.from('payments').select('*'),
        supabase.from('team_config').select('*').single()
      ]);

      if (playersRes.data) setPlayers(playersRes.data);
      if (paymentsRes.data) setPayments(paymentsRes.data);
      if (configRes.data) setTeamConfig(configRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const calculateBalance = (playerId) => {
    const playerPayments = payments.filter(p => p.player_id === playerId);
    const totalPaid = playerPayments.reduce((sum, p) => sum + p.amount, 0);
    const monthsOwed = teamConfig?.months?.split(',').length || 10;
    const totalOwed = (teamConfig?.cuota_fija || 100000) * monthsOwed;
    return totalPaid - totalOwed;
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!formData.player_id || !formData.amount) return;

    try {
      const { error } = await supabase.from('payments').insert([
        {
          player_id: parseInt(formData.player_id),
          month: formData.month,
          amount: parseInt(formData.amount)
        }
      ]);

      if (!error) {
        setFormData({ player_id: '', month: '03', amount: '' });
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      await supabase.from('payments').delete().eq('id', paymentId);
      fetchData();
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">{teamConfig?.team_name}</h1>
          <p className="text-blue-100 text-sm mt-1">Recaudación 2024</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Tesorero Toggle */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isTesorero}
                onChange={(e) => setIsTesorero(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-gray-700 font-medium">Soy tesorero (editar pagos)</span>
            </label>
          </div>
          {isTesorero && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              + Registrar pago
            </button>
          )}
        </div>

        {/* Form Modal */}
        {showForm && isTesorero && (
          <div className="mb-8 bg-white border-2 border-green-200 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Registrar pago</h2>
            <form onSubmit={handleAddPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jugador</label>
                <select
                  value={formData.player_id}
                  onChange={(e) => setFormData({ ...formData, player_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecciona un jugador</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {['03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
                      <option key={m} value={m}>
                        {['', '', '', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][parseInt(m)]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monto</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="100000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Guardar pago
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Players Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <th className="px-6 py-4 text-left font-semibold">Jugador</th>
                <th className="px-6 py-4 text-right font-semibold">Pagado</th>
                <th className="px-6 py-4 text-right font-semibold">Saldo</th>
                {isTesorero && <th className="px-6 py-4 text-center font-semibold">Acción</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {players.map((player, idx) => {
                const balance = calculateBalance(player.id);
                const paid = payments
                  .filter((p) => p.player_id === player.id)
                  .reduce((sum, p) => sum + p.amount, 0);

                return (
                  <tr
                    key={player.id}
                    className={`hover:bg-gray-50 transition ${
                      idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{player.name}</td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {formatCurrency(paid)}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-bold ${
                        balance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                    </td>
                    {isTesorero && (
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setFormData({
                              player_id: player.id.toString(),
                              month: '03',
                              amount: ''
                            });
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Editar
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Payment History */}
        {isTesorero && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Historial de pagos</h2>
            <div className="space-y-3">
              {payments
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 20)
                .map((payment) => {
                  const player = players.find((p) => p.id === payment.player_id);
                  return (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between bg-white p-4 rounded-lg shadow border-l-4 border-blue-600"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{player?.name}</p>
                        <p className="text-sm text-gray-500">
                          Mes {payment.month} · {formatCurrency(payment.amount)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeletePayment(payment.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 text-center py-6 mt-12 text-sm">
        <p>Recaudación Barkojba + 35 · Temporada 2024</p>
      </footer>
    </div>
  );
}
