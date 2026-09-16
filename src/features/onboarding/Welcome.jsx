import { WelcomeWorld } from "./WelcomeWorld.jsx";
import { RegistrationForm } from "./RegistrationForm.jsx";
export function Welcome(props) {
  return (
    <main className="welcome">
      <WelcomeWorld />
      <RegistrationForm {...props} />
    </main>
  );
}
