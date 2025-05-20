"use client";
import { useSession } from "next-auth/react";

import * as React from "react";
import {
  // AudioWaveform,
  // BookOpen,
  Bot,
  // Command,
  Frame,
  // GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
// import { NavMainMenu } from "@/components/nav-mainmenu";
// import { NavMain } from "@/components/nav-main";
import { NavMainCustom } from "@/components/nav-menucustom";

//import { NavProjects } from "@/components/nav-projects";
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
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      canCollapse: false,
      items: [],
    },
    {
      title: "Absensi",
      url: "/dashboard/absensi",
      icon: SquareTerminal,
      isActive: true,
      canCollapse: false,
      items: [],
    },
    {
      title: "History",
      url: "#",
      icon: Settings2,
      canCollapse: true,
      items: [
        {
          title: "Day",
          url: "/dashboard/histori",
        },
        {
          title: "Month",
          url: "/dashboard/histori/month",
        },
        {
          title: "All",
          url: "/dashboard/histori/all",
        },
      ],
    },
    {
      title: "Class",
      url: "#",
      icon: Bot,
      canCollapse: true,
      items: [
        {
          title: "General",
          url: "/dashboard/kelas",
        },
        {
          title: "People",
          url: "/dashboard/kelas/people",
        },
        {
          title: "Schedule",
          url: "/dashboard/kelas/schedule",
        },
        {
          title: "Template",
          url: "/dashboard/kelas/template",
        },
        {
          title: "Archieve",
          url: "/dashboard/kelas/archieve",
        },
      ],
    },
  ],
  // teams: [
  //   {
  //     name: "Acme Inc",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  //   {
  //     name: "Acme Corp.",
  //     logo: AudioWaveform,
  //     plan: "Startup",
  //   },
  //   {
  //     name: "Evil Corp.",
  //     logo: Command,
  //     plan: "Free",
  //   },
  // ],
  // navMain: [
  //   {
  //     title: "Class",
  //     url: "/dashboard/kelas",
  //     icon: SquareTerminal,
  //     isActive: true,
  //     items: [
  //       {
  //         title: "Kelas",
  //         url: "/dashboard/kelas",
  //       },
  //       {
  //         title: "Absensi",
  //         url: "/dashboard/absensi",
  //       },
  //       {
  //         title: "Settings",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Models",
  //     url: "#",
  //     icon: Bot,
  //     items: [
  //       {
  //         title: "Genesis",
  //         url: "#",
  //       },
  //       {
  //         title: "Explorer",
  //         url: "#",
  //       },
  //       {
  //         title: "Quantum",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Documentation",
  //     url: "#",
  //     icon: BookOpen,
  //     items: [
  //       {
  //         title: "Introduction",
  //         url: "#",
  //       },
  //       {
  //         title: "Get Started",
  //         url: "#",
  //       },
  //       {
  //         title: "Tutorials",
  //         url: "#",
  //       },
  //       {
  //         title: "Changelog",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Settings",
  //     url: "#",
  //     icon: Settings2,
  //     items: [
  //       {
  //         title: "General",
  //         url: "#",
  //       },
  //       {
  //         title: "Team",
  //         url: "#",
  //       },
  //       {
  //         title: "Billing",
  //         url: "#",
  //       },
  //       {
  //         title: "Limits",
  //         url: "#",
  //       },
  //     ],
  //   },
  // ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
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
    {
      name: "History",
      url: "/dashboard/histori",
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
        {/* <NavMainMenu projects={sampledata.NavMenu} />
        <NavMain items={sampledata.navMain} /> */}
        <NavMainCustom items={sampledata.navMain} />

        {/* <NavProjects projects={sampledata.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
