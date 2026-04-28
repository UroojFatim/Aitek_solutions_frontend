import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function Welcome() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <Typography variant="h2" className="mb-4">🎉 Congrats!</Typography>
      <Typography variant="lead" className="mb-6">
        You are signed in now.
      </Typography>
      <Button color="blue" onClick={() => navigate("/dashboard/home")}>
        Go to Dashboard
      </Button>
    </section>
  );
}