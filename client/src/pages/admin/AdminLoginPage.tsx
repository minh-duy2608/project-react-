import LoginForm from "../auth/LoginForm";

export default function LoginPage() {
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
      <LoginForm />
    </div>
  );
}