import { useAuth } from "@/util/auth";
import { Outlet, useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export default function Tailfin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else {
      navigate("/logbook");
    }
  }, [user, loading, navigate]);

  return <Outlet />;
}
