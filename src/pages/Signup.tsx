import { Shield } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CompleteOrganizationForm } from "../components/forms/CompleteOrganizationForm";
import SignupForm from "../components/forms/SignupForm";
import { Loading } from "../components/ui/Loading";
import { signup } from "../services/auth/AuthService";
import { setSessionUser } from "../store/reducers/session";
import { useAppDispatch } from "../store/store";

type SignupFormInputs = {
  email: string;
  name: string;
  phone: string;
  password: string;
};

const Signup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [signupData, setSignupData] = useState<SignupFormInputs>();
  const [, setOrganizationData] = useState();
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSignupNext = (data: any) => {
    setSignupData(data);
    setStep(2);
  };

  const handleFinalSubmit = async (orgData: any) => {
    setOrganizationData(orgData);
    const finalData = { ...signupData, ...orgData };
    setAuthError(null);
    setLoading(true);
    try {
      const user = await signup(finalData);
      if (user) {
        dispatch(setSessionUser(user));
      }
      // redirecionar ou mostrar mensagem de sucesso
      setSignupData(undefined);
      setOrganizationData(undefined);
      navigate("/");
    } catch (err: Error | unknown) {
      setAuthError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Shield className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign up
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your dashboard and manage your organization
        </p>
      </div>

      {authError && (
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-fadeIn">
            {authError}
          </div>
        </div>
      )}
      {loading ? (
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm animate-fadeIn">
            <Loading />
            Loading...
          </div>
        </div>
      ) : (
        <div>
          {step === 1 ? (
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white p-8 shadow sm:rounded-lg border border-gray-100">
                <SignupForm
                  onNext={handleSignupNext}
                  defaultValues={signupData}
                />
              </div>
            </div>
          ) : (
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
              <CompleteOrganizationForm
                onSubmit={handleFinalSubmit}
                goBack={() => setStep(1)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Signup;
