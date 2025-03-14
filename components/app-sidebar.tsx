"use client";
import { useSession } from "next-auth/react";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavMainMenu } from "@/components/nav-mainmenu";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
//import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  //SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const sampledata = {
  user: {
    name: "UnAuthenticated",
    email: "UnAuthenticated",
    avatar: "/avatar_default.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Class",
      url: "/dashboard/kelas",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Kelas",
          url: "/dashboard/kelas",
        },
        {
          title: "Absensi",
          url: "/dashboard/absensi",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
  NavMenu: [
    {
      name: "Home",
      url: "/dashboard",
      icon: Frame,
    },
    {
      name: "Kelas",
      url: "/dashboard/kelas",
      icon: PieChart,
    },
    {
      name: "Absensi",
      url: "/dashboard/absensi",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const userData = {
    user: {
      name: session?.user?.name || "Anonymous",
      email: session?.user?.email || "No emails",
      avatar: session?.user?.image || "/avatar_default.png",
    },
    teams: [
      // teams dan data lainnya...
    ],
    // NavMain dan data lainnya...
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* <SidebarHeader>
        <TeamSwitcher teams={sampledata.teams} />
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain items={sampledata.navMain} />
        <NavMainMenu projects={sampledata.NavMenu} />
        <NavProjects projects={sampledata.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
