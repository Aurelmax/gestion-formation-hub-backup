"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type AuthMode = 'email' | 'sms' | 'credentials';

export default function NewLoginForm() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>('email');
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [smsStep, setSmsStep] = useState<'phone' | 'verify'>('phone');

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("Un lien de connexion a été envoyé à votre adresse email!");
      }
    } catch (error) {
      setError("Erreur lors de l'envoi du lien");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendSmsCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/sms/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Code SMS envoyé!");
        setSmsStep('verify');
      } else {
        setError(data.error || "Erreur lors de l'envoi du code");
      }
    } catch (error) {
      setError("Erreur lors de l'envoi du code SMS");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySmsCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/sms/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, code: smsCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Code vérifié! Connexion en cours...");
        // Rediriger vers le dashboard après un court délai
        setTimeout(() => {
          router.push("/admin");
        }, 1500);
      } else {
        setError(data.error || "Code invalide");
      }
    } catch (error) {
      setError("Erreur lors de la vérification du code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
      } else if (result?.ok) {
        router.push("/admin");
      }
    } catch (error) {
      setError("Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Connexion
        </h1>

        {/* Sélecteur de mode d'authentification */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => {setAuthMode('email'); setError(""); setSuccess("");}}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              authMode === 'email'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => {setAuthMode('sms'); setError(""); setSuccess(""); setSmsStep('phone');}}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              authMode === 'sms'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            SMS
          </button>
          <button
            type="button"
            onClick={() => {setAuthMode('credentials'); setError(""); setSuccess("");}}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              authMode === 'credentials'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Mot de passe
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Formulaire Email */}
        {authMode === 'email' && (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="exemple@mail.com"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </form>
        )}

        {/* Formulaire SMS */}
        {authMode === 'sms' && (
          <>
            {smsStep === 'phone' && (
              <form onSubmit={handleSendSmsCode} className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Numéro de téléphone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="+33612345678"
                  />
                  <p className="mt-1 text-xs text-gray-500">Format international requis</p>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Envoi...' : 'Envoyer le code'}
                </button>
              </form>
            )}

            {smsStep === 'verify' && (
              <form onSubmit={handleVerifySmsCode} className="space-y-4">
                <div>
                  <label htmlFor="sms-code" className="block text-sm font-medium text-gray-700">
                    Code de vérification
                  </label>
                  <input
                    id="sms-code"
                    type="text"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    required
                    maxLength={6}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center text-2xl font-mono"
                    placeholder="123456"
                  />
                  <p className="mt-1 text-xs text-gray-500">Code envoyé au {phone}</p>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Vérification...' : 'Vérifier le code'}
                </button>
                <button
                  type="button"
                  onClick={() => setSmsStep('phone')}
                  className="w-full py-2 px-4 text-gray-600 font-medium hover:text-gray-800"
                >
                  ← Changer le numéro
                </button>
              </form>
            )}
          </>
        )}

        {/* Formulaire Credentials (ancien système) */}
        {authMode === 'credentials' && (
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div>
              <label htmlFor="cred-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="cred-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="exemple@mail.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}