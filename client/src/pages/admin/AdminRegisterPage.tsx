import RegisterForm from "../auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        height: "100%",
        width: "100vw",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <style>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        html {
          overflow: hidden;
          height: 100%;
        }
      `}</style>
      <RegisterForm />
    </div>
  );
}