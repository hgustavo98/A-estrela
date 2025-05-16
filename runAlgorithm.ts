// Inicie a busca
export async function startBusca() {
  try {
    const res = await fetch('http://localhost:5000/api/start', { method: 'POST' });
    if (!res.ok) throw new Error('Servidor indisponível');
    const data = await res.json();
    return data;
  } catch {
    return { error: 'Não foi possível conectar ao servidor Python.' };
  }
}

// Dê um passo
export async function proximoPasso() {
  try {
    const res = await fetch('http://localhost:5000/api/step', { method: 'POST' });
    if (!res.ok) throw new Error('Servidor indisponível');
    const data = await res.json();
    return data;
  } catch {
    return { error: 'Não foi possível conectar ao servidor Python.' };
  }
}

// Resete a busca
export async function resetBusca() {
  try {
    const res = await fetch('http://localhost:5000/api/reset', { method: 'POST' });
    if (!res.ok) throw new Error('Servidor indisponível');
    const data = await res.json();
    return data;
  } catch {
    return { error: 'Não foi possível conectar ao servidor Python.' };
  }
}