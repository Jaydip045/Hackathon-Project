import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MapPin, Plane, ArrowLeft } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <MapPin className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-gray-900 mb-3" style={{ fontFamily: "Georgia, serif", fontSize: "3rem" }}>
          404
        </h1>
        <h2 className="text-gray-700 mb-3">Destination Not Found</h2>
        <p className="text-gray-500 mb-8">
          Looks like you've wandered off the map! Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1 as any)}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-amber-400 text-amber-600 rounded-xl hover:bg-amber-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            <Plane className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
