const ADMIN_EMAILS = [
  "amunico07@gmail.com",
  "alex.moreno32390@gmail.com",
];

export function isAdminEmail(email: string | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email);
}
