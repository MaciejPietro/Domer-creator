import GoogleIcon from "@/Auth/assets/pictures/google.svg?react";
import FacebookIcon from "@/Auth/assets/pictures/facebook.svg?react";
import AppleIcon from "@/Auth/assets/pictures/apple.svg?react";

const providers = [
  {
    name: "Facebook",
    icon: FacebookIcon,
  },
  {
    name: "Google",
    icon: GoogleIcon,
  },
  {
    name: "Apple",
    icon: AppleIcon,
  },
];

const Oauth2 = () => {
  return null;

  return (
    <div className="mt-2 max-w-md mx-auto blur-sm">
      <div className="relative flex justify-center text-center">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-px bg-gray-150"></div>

        <h3 className="text-gray-400 px-8 bg-white relative">Kontynuuj z</h3>
      </div>

      <div className="mt-4 flex gap-8 justify-center">
        {providers.map(({ name, icon: Icon }) => (
          <button
            key={name}
            className="w-16 h-16 flex justify-center items-center cursor-pointer border border-gray-300 rounded-full"
          >
            <Icon />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Oauth2;
