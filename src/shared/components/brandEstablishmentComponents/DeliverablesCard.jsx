import React from "react";
import { FileText } from "lucide-react";
import Card from "./Card";

const DeliverablesCard = () => {
  return (
    <div className="mt-6">
      <Card>
        <div className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <FileText size={20} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold">Deliverables by End of Phase</h3>
          </div>
        </div>

        <div className="px-6 pb-6">
          <ul className="list-disc pl-5 space-y-2">
            <li>Defined and documented brand story</li>
            <li>Visual + messaging kit</li>
            <li>Media kit (photos, doctor reel, testimonials)</li>
            <li>Live branded content across 2–3 channels</li>
            <li>Reputation score and testimonial library</li>
            <li>Strategy transition plan for ongoing growth</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default DeliverablesCard;
