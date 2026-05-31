import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Mail, Lock, User, Shield, Stethoscope, Users, Home } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import asipecaLogo from "../../imports/Asipeca_logo-4.jpg";

type UserType = "admin" | "doctor" | "reception" | "family" | null;

export default function LoginScreen() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Check if user came directly to register
  const searchParams = new URLSearchParams(window.location.search);
  const directRegister = searchParams.get('register') === 'true';
  const [showCreateAccount, setShowCreateAccount] = useState(directRegister);

  const userTypes = [
    {
      type: "admin" as UserType,
      label: "Administrador",
      description: "Acesso total ao sistema",
      icon: Shield,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700"
    },
    {
      type: "doctor" as UserType,
      label: "Doutor / Profissional de saúde",
      description: "Acesso aos pacientes e prontuários",
      icon: Stethoscope,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700"
    },
    {
      type: "reception" as UserType,
      label: "Recepção",
      description: "Acesso ao agendamento de consultas",
      icon: Users,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700"
    },
    {
      type: "family" as UserType,
      label: "Familiar / Paciente",
      description: "Acesso às próprias informações",
      icon: Home,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-700"
    }
  ];

  const handleLogin = () => {
    // Test accounts routing
    const routes: Record<string, string> = {
      "admin@asipeca.org.br": "/admin",
      "doutor@asipeca.org.br": "/therapist",
      "recepcao@asipeca.org.br": "/reception",
      "paciente@asipeca.org.br": "/family"
    };

    const route = routes[email.toLowerCase()];
    if (route) {
      navigate(route);
    } else {
      alert("Credenciais inválidas. Use uma das contas de teste.");
    }
  };

  const handleCreateAccount = () => {
    setShowCreateAccount(true);
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Seu cadastro foi concluído. Aguarde a liberação da administração.");
    setShowCreateAccount(false);
  };

  if (showCreateAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50 py-6 sm:py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setShowCreateAccount(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Voltar para login</span>
          </button>

          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="bg-white rounded-2xl p-3 sm:p-4 inline-block shadow-md mb-3 sm:mb-4">
              <img src={asipecaLogo} alt="ASIPECA" className="h-16 sm:h-20 w-auto" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-3 sm:mb-4">ASIPECA</h2>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Criar nova conta</h1>
            <p className="text-sm sm:text-base text-gray-600">Preencha os dados abaixo para solicitar acesso</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmitRegistration} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8 lg:p-10 border border-gray-100">
            <div className="space-y-6">
              {/* Profile Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Tipo de perfil *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.type}
                        type="button"
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedType === type.type
                            ? `${type.borderColor} ${type.bgColor}`
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedType(type.type)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${selectedType === type.type ? type.textColor : "text-gray-500"}`} />
                          <span className={`font-medium text-sm ${selectedType === type.type ? type.textColor : "text-gray-700"}`}>
                            {type.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* For Family/Responsible */}
              {selectedType === "family" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nome completo *</label>
                    <Input required placeholder="Nome do responsável" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail *</label>
                    <Input required type="email" placeholder="seu@email.com" className="rounded-xl" />
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-bold text-gray-900 mb-4">Informações do Paciente</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do paciente *</label>
                        <Input required placeholder="Nome completo do paciente" className="rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Idade do paciente *</label>
                        <Input required type="number" placeholder="Idade" className="rounded-xl" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* For Professionals (Doctor, Reception, Admin) */}
              {(selectedType === "doctor" || selectedType === "admin" || selectedType === "reception") && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nome completo *</label>
                    <Input required placeholder="Digite seu nome completo" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail *</label>
                    <Input required type="email" placeholder="seu@email.com" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo / Função *</label>
                    <Input required placeholder="Ex: Fonoaudiólogo, Recepcionista, Coordenador" className="rounded-xl" />
                  </div>
                </>
              )}

              {/* Password */}
              <div className="border-t pt-6 mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Senha *</label>
                    <Input required type="password" placeholder="Mínimo 6 caracteres" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar senha *</label>
                    <Input required type="password" placeholder="Digite a senha novamente" className="rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-lg"
                >
                  Enviar cadastro
                </Button>
                <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                  Seu cadastro será analisado pela administração antes da aprovação
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50 flex flex-col">
      {/* Back Button */}
      <div className="p-4 sm:p-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Voltar</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <img src={asipecaLogo} alt="ASIPECA" className="h-20 sm:h-28 w-auto mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Bem-vindo</h1>
            <p className="text-sm sm:text-base text-gray-600">Faça login para acessar o sistema</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8 border border-gray-100">
            {/* User Type Selection */}
            {!selectedType ? (
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Selecione seu tipo de acesso:</h2>
                {userTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.type}
                      onClick={() => setSelectedType(type.type)}
                      className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all hover:shadow-md ${type.borderColor} hover:${type.bgColor} bg-white`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`p-2 sm:p-3 bg-gradient-to-br ${type.color} rounded-xl`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{type.label}</div>
                          <div className="text-xs sm:text-sm text-gray-600 truncate">{type.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selected Type Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const selectedUserType = userTypes.find(t => t.type === selectedType);
                      if (!selectedUserType) return null;
                      const Icon = selectedUserType.icon;
                      return (
                        <>
                          <div className={`p-2 bg-gradient-to-br ${selectedUserType.color} rounded-lg`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{selectedUserType.label}</div>
                            <div className="text-xs text-gray-500">{selectedUserType.description}</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <button
                    onClick={() => setSelectedType(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Alterar
                  </button>
                </div>

                {/* Login Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="pl-10 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 rounded-xl"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl py-5 sm:py-6 font-semibold shadow-lg text-base"
                  >
                    Entrar
                  </Button>

                  <button className="w-full text-xs sm:text-sm text-gray-600 hover:text-green-600 transition-colors">
                    Esqueci minha senha
                  </button>
                </div>

                {/* Test Accounts Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
                  <div className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">Contas de teste:</div>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div>• admin@asipeca.org.br</div>
                    <div>• doutor@asipeca.org.br</div>
                    <div>• recepcao@asipeca.org.br</div>
                    <div>• paciente@asipeca.org.br</div>
                  </div>
                </div>
              </div>
            )}

            {/* Create Account */}
            <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-3">Ainda não tem uma conta?</p>
              <button
                onClick={handleCreateAccount}
                className="w-full px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all font-semibold rounded-xl text-sm sm:text-base"
              >
                Criar conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
