import React from "react";
import { NavLink, useNavigate, useRouteError } from "react-router";
import errorImg from "../../assets/error.jpg";

const ErrorPage = () => {
  const navigate = useNavigate();
  // Always call hooks unconditionally
  const error = useRouteError();

  // Sensible defaults for wildcard 404 (no thrown error)
  let status = 404;
  let title = "Page not found";
  let message =
    "The page you’re looking for doesn’t exist or has been moved.";

  // If the router provided an error, refine the info
  if (error) {
    const err = /** @type {any} */ (error);
    if (typeof err === "object" && err !== null) {
      if (typeof err.status === "number") {
        status = err.status;
        title = status === 404 ? "Page not found" : "Something went wrong";
      } else {
        status = 500;
        title = "Something went wrong";
      }
      message = err.statusText || err.message || message;
    } else {
      status = 500;
      title = "Something went wrong";
    }
  }

  return (
     <section className="py-10 md:py-14">
   
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div className="bg-base-100">
          <div className="max-w-screen-lg mx-auto px-4 md:px-8">
            {/* Larger image on top */}
            <img
              src={errorImg}
              alt="Error"
              className="w-full max-h-[24rem] md:max-h-[30rem] object-contain select-none"
              loading="lazy"
            />

            {/* Larger text below image */}
            <div className="mt-6 text-center">
              <p className="text-sm md:text-base uppercase tracking-wider opacity-60">
                Error {status}
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold text-red-700">
                {title}
              </h1>
              <p className="mt-3 text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
                {message}
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <NavLink to="/" className="btn bg-red-700 text-white hover:bg-red-800">
                  Go to Home
                </NavLink>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-outline text-red-500 border-white"
                >
                  Go Back
                </button>
              </div>
            </div>

            {/* Tight bottom spacer */}
            <div className="pb-6" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
