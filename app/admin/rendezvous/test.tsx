'use client';

export default function TestComponent() {
  console.log('TEST COMPONENT LOADED');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">TEST - Si vous voyez ceci, le routage fonctionne</h1>
      <p>Ouvrez la console pour voir les logs</p>
    </div>
  );
}