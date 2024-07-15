import Added from "@/components/ui/added";
import Popular from "@/components/ui/popular";
import Updated from "@/components/ui/updated";

const Homepage = async () => {
  return (
    <main data-theme="dracula">
      <Updated />
      <div className="divider divider-info">or</div>
      <Popular />
      <div className="divider divider-accent">or</div>
      <Added />
    </main>
  );
};

export default Homepage;
