import Added from "@/components/ui/added";
import Popular from "@/components/ui/popular";
import Updated from "@/components/ui/updated";
import LoginDetect from "@/utils/login/check";

const Homepage = async () => {
  return (
    <main data-theme="dracula">
      <Updated />
      <div className="divider divider-info">or</div>
      <Popular />
      <div className="divider divider-accent">or</div>
      <Added />
      <LoginDetect />
    </main>
  );
};

export default Homepage;
