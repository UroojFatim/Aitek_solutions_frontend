
import React from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-day-picker/dist/style.css";

// Material Tailwind-like Input Component
const Input = ({ label, value, onChange, onClick, error, ...props }) => (
  <div className="relative w-full">
    <input
      type="text"
      readOnly
      onClick={onClick}
      value={value}
      placeholder=" "
      className={`peer w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 cursor-pointer transition-all duration-200 ${
        error 
          ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
          : 'border-blue-gray-200 focus:ring-blue-500 focus:border-blue-500'
      }`}
      {...props}
    />
    <label className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 ${
      error 
        ? 'text-red-500 peer-focus:text-red-500' 
        : 'text-blue-gray-400 peer-focus:text-blue-500'
    }`}>
      {label}
    </label>
  </div>
);

// Popover Components
const Popover = ({ children, placement = "bottom" }) => {
  return <div className="relative inline-block w-full">{children}</div>;
};

const PopoverHandler = ({ children }) => {
  return <div className="w-full">{children}</div>;
};

const PopoverContent = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute top-full left-0 z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        {children}
      </div>
    </>
  );
};

// Main DatePicker Component
const DatePicker = ({ 
  label = "Select a Date", 
  value, 
  onChange, 
  error,
  disabled = false,
  placeholder,
  ...props 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleDateSelect = (selectedDate) => {
    onChange?.(selectedDate);
    setIsOpen(false);
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const displayValue = value ? format(value, "PPP") : "";

  return (
    <div className="w-full">
      <Popover placement="bottom">
        <PopoverHandler>
          <Input
            label={label}
            onChange={() => null}
            onClick={handleInputClick}
            value={displayValue}
            error={error}
            disabled={disabled}
            {...props}
          />
        </PopoverHandler>
        <PopoverContent isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DayPicker
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            showOutsideDays
            className="border-0"
            classNames={{
              caption: "flex justify-center py-2 mb-4 relative items-center",
              caption_label: "text-sm font-medium text-gray-900",
              nav: "flex items-center",
              nav_button: "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
              nav_button_previous: "absolute left-1.5",
              nav_button_next: "absolute right-1.5",
              table: "w-full border-collapse",
              head_row: "flex font-medium text-gray-900",
              head_cell: "m-0.5 w-9 font-normal text-sm",
              row: "flex w-full mt-2",
              cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal hover:bg-gray-100 rounded-md cursor-pointer",
              day_range_end: "day-range-end",
              day_selected: "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
              day_today: "rounded-md bg-gray-200 text-gray-900",
              day_outside: "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
              day_disabled: "text-gray-500 opacity-50 cursor-not-allowed",
              day_hidden: "invisible",
            }}
            components={{
              IconLeft: ({ ...props }) => (
                <ChevronLeft {...props} className="h-4 w-4 stroke-2" />
              ),
              IconRight: ({ ...props }) => (
                <ChevronRight {...props} className="h-4 w-4 stroke-2" />
              ),
            }}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <div className="mt-1 text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};


export default DatePicker;