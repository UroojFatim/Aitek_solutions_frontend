import { Button, Typography } from "@material-tailwind/react";

const EnrollmentCompletionMessage = () => {
  return (
    <div className="max-w-2xl mx-auto min-h-screen flex flex-col items-center justify-center text-center gap-5">
      <Typography variant="h2"
      className="text-light-text dark:text-dark-text font-bold text-2xl sm:text-3xl md:text-4xl">
        Thank you for completing 
        <br />
        your enrollment!
      </Typography>
      <p className="w-full dark:text-dark-text text-light-text leading-relaxed text-sm sm:text-base lg:text-lg">
        You’re now one step closer to establishing your brand with confidence.
        To get started, please schedule a one-on-one appointment with your Brand
        Establishment Consultant. During this session, we’ll walk you through
        the process, answer your questions, and ensure everything is tailored to
        your goals. Choose a time that works best for you below to begin your
        journey toward building a strong and lasting brand presence.
      </p>
      <a
        href="https://outlook.office.com/book/BrandEstablishment@aitek-solutions.com/?ismsaljsauthenabled"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="bg-primary hover:bg-primary/90 text-white font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 rounded-lg shadow-lg transition w-full sm:w-auto">
          Schedule Appointment
        </Button>
      </a>
    </div>
  );
};

export default EnrollmentCompletionMessage;
