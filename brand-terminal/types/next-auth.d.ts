import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan: "Free" | "Pro";
    };
  }

  interface User {
    plan?: "Free" | "Pro";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan?: "Free" | "Pro";
  }
}
