import LeafPicture from "@/Auth/assets/pictures/leaf.svg?react";

import BackButton from "@/Common/components/ui/BackButton";
import Button from "@/Common/components/ui/Button";

export default function RemindPasswordSent() {
  return (
    <div className="px-4 min-h-screen flex flex-col justify-center">
      <div className="fixed top-0 left-0 w-full px-4">
        <div className="h-24 flex items-center">
          <BackButton to="/logowanie" />
        </div>

        <LeafPicture className="absolute bottom-0 -right-4 w-28 transform translate-y-1/2" />
      </div>

      <div className="mt-12 h-full flex flex-col justify-center">
        <h1 className="text-green-500 text-3xl max-w-[280px] mx-auto font-semibold text-center">
          Link aktywacyjny został wysłany
        </h1>
        <p className="text-gray-500  mt-2 text-center">
          Sprawdź swoją skrzynkę email.
        </p>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex justify-center">
          <Button to="/logowanie" className="mx-auto">
            Wróć do logowania
          </Button>
        </div>
      </div>
    </div>
  );
}
