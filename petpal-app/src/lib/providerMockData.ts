export type BookingStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";

export interface Booking {
  id: string;
  ownerName: string;
  ownerAvatar: string;
  petName: string;
  petType: string;
  petBreed: string;
  petAge: string;
  service: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  pets: number;
  total: number;
  status: BookingStatus;
  message: string;
  address?: string;
  specialNeeds?: string;
  rating?: number;
  reviewText?: string;
}

export interface EarningEntry {
  month: string;
  amount: number;
  bookings: number;
}

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "b1",
    ownerName: "Sarah Chen",
    ownerAvatar: "SC",
    petName: "Mochi",
    petType: "Dog",
    petBreed: "Shiba Inu",
    petAge: "3 years",
    service: "Home Boarding",
    checkIn: "2026-07-22",
    checkOut: "2026-07-28",
    nights: 6,
    pets: 1,
    total: 330,
    status: "pending",
    message: "Mochi is very friendly but gets nervous around loud noises. He loves fetch and cuddles. Please make sure his blanket is with him.",
    specialNeeds: "Allergic to chicken-based food. Needs 2 walks per day.",
  },
  {
    id: "b2",
    ownerName: "Tom Blake",
    ownerAvatar: "TB",
    petName: "Luna & Stella",
    petType: "Cat",
    petBreed: "Ragdoll × 2",
    petAge: "2 & 4 years",
    service: "Home Boarding",
    checkIn: "2026-07-24",
    checkOut: "2026-07-27",
    nights: 3,
    pets: 2,
    total: 330,
    status: "pending",
    message: "They are indoor cats, very calm and easy. Luna is shy at first but warms up quickly. Stella loves lap time.",
    specialNeeds: "Wet food twice daily. Luna takes a daily thyroid tablet in her food.",
  },
  {
    id: "b3",
    ownerName: "Alice Wang",
    ownerAvatar: "AW",
    petName: "Biscuit",
    petType: "Dog",
    petBreed: "Golden Retriever",
    petAge: "5 years",
    service: "Home Boarding",
    checkIn: "2026-07-18",
    checkOut: "2026-07-22",
    nights: 4,
    pets: 1,
    total: 220,
    status: "confirmed",
    message: "Biscuit is a big sweetheart. He is fully trained and loves other dogs. Please give him lots of playtime!",
    specialNeeds: "Joint supplement in morning meal.",
  },
  {
    id: "b4",
    ownerName: "James Park",
    ownerAvatar: "JP",
    petName: "Pepper",
    petType: "Dog",
    petBreed: "Cavoodle",
    petAge: "1 year",
    service: "Dog Walking",
    checkIn: "2026-07-20",
    checkOut: "2026-07-20",
    nights: 1,
    pets: 1,
    total: 35,
    status: "in-progress",
    message: "30 min walk around the park please, she pulls a bit on leash still learning!",
  },
  {
    id: "b5",
    ownerName: "Mei Tanaka",
    ownerAvatar: "MT",
    petName: "Sushi",
    petType: "Cat",
    petBreed: "British Shorthair",
    petAge: "6 years",
    service: "Home Boarding",
    checkIn: "2026-07-05",
    checkOut: "2026-07-12",
    nights: 7,
    pets: 1,
    total: 385,
    status: "completed",
    message: "Sushi is independent and low maintenance. Just make sure her litter is clean!",
    rating: 5,
    reviewText: "Emma was absolutely amazing! Sushi was happy and well cared for. Got daily photo updates. 10/10 will book again.",
  },
  {
    id: "b6",
    ownerName: "David Lee",
    ownerAvatar: "DL",
    petName: "Rocky",
    petType: "Dog",
    petBreed: "Labrador",
    petAge: "4 years",
    service: "Home Boarding",
    checkIn: "2026-06-20",
    checkOut: "2026-06-25",
    nights: 5,
    pets: 1,
    total: 275,
    status: "completed",
    rating: 5,
    reviewText: "Rocky was so happy staying with Emma. She sent photos every day. Highly recommend!",
    message: "Rocky loves swimming and fetch. He is a big dog but very gentle.",
  },
  {
    id: "b7",
    ownerName: "Sophie Duval",
    ownerAvatar: "SD",
    petName: "Coco",
    petType: "Rabbit",
    petBreed: "Holland Lop",
    petAge: "2 years",
    service: "Home Visit",
    checkIn: "2026-07-21",
    checkOut: "2026-07-23",
    nights: 2,
    pets: 1,
    total: 90,
    status: "confirmed",
    message: "Coco needs fresh veggies morning and evening and her hay topped up. She is very curious and loves exploring.",
    specialNeeds: "No spinach or iceberg lettuce.",
  },
];

export const MONTHLY_EARNINGS: EarningEntry[] = [
  { month: "Feb", amount: 820, bookings: 4 },
  { month: "Mar", amount: 1240, bookings: 6 },
  { month: "Apr", amount: 980, bookings: 5 },
  { month: "May", amount: 1560, bookings: 8 },
  { month: "Jun", amount: 1890, bookings: 9 },
  { month: "Jul", amount: 1420, bookings: 7 },
];

export const PROVIDER_PROFILE = {
  name: "Emma Richardson",
  avatar: "ER",
  location: "Fitzroy, Melbourne VIC 3065",
  bio: "Lifelong animal lover with 8+ years caring for dogs and cats. My home has a big secure yard — your pup will love it! I treat every pet like my own.",
  phone: "+61 400 000 000",
  email: "emma.r@example.com",
  languages: ["English"],
  yearsExp: 8,
  homeType: "house" as "house" | "apartment" | "farm",
  hasYard: true,
  maxPets: 3,
  serviceRadius: 5,
  services: [
    { type: "boarding", name: "Home Boarding", price: 55, enabled: true, unit: "night" },
    { type: "home-visit", name: "Home Visit", price: 45, enabled: true, unit: "visit" },
    { type: "dog-walking", name: "Dog Walking", price: 35, enabled: true, unit: "walk" },
    { type: "overnight", name: "Overnight Care", price: 80, enabled: false, unit: "night" },
    { type: "cat-sitting", name: "Cat Sitting", price: 50, enabled: true, unit: "night" },
    { type: "daycare", name: "Doggy Daycare", price: 45, enabled: false, unit: "day" },
  ],
  sizeSurcharge: { medium: 10, large: 20 },
  holidaySurcharge: 20,
  addOns: [
    { type: "pickup", name: "Pickup & Drop-off", price: 25, enabled: true },
    { type: "freshfood", name: "Fresh Food Meals", price: 15, enabled: true },
    { type: "extraWalk", name: "Extra Daily Walk", price: 20, enabled: false },
    { type: "report", name: "Daily Photo Report", price: 10, enabled: true },
  ],
  petTypes: ["dog", "cat"],
  certificates: [
    { name: "Pet First Aid Certificate", issuer: "Red Cross", year: 2024, verified: true },
    { name: "Professional Dog Training", issuer: "NDTF", year: 2022, verified: true },
  ],
  unavailableDates: ["2026-07-29", "2026-07-30", "2026-07-31", "2026-08-01"],
};
