// src/components/RibbonInvite.jsx
export default function RibbonInvite() {
  return (
    <div className="bg-primary text-white text-center py-4 px-4">
      <p className="text-base font-medium">
        📣 Register for Upcoming events! &nbsp;
        <a href="/events" className="underline hover:text-yellow-300">
          Click here to sign up
        </a>
      </p>
    </div>
  );
}
