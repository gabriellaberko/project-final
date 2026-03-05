import { SignupForm } from "../forms/SignupForm";
import { LoginForm } from "../forms/LoginForm";
import { motion } from "framer-motion";

import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";

const MotionCard = motion(Card);

type Props = {
  activeTab: number;
  onTabChange: (value: number) => void;
};

export const AuthCard = ({ activeTab, onTabChange }: Props) => {
  return (
    <MotionCard
      layout
      sx={{
        width: "100%",
        maxWidth: "clamp(420px, 40vw, 900px)",
        p: { xs: 3, sm: 4, md: 5, lg: 6 },
        boxShadow: "md",
      }}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Stack
        spacing={{ xs: 3, md: 4, lg: 5 }}
        sx={{ height: "100%" }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, v) => typeof v === "number" && onTabChange(v)}
        >
          <TabList
            disableUnderline
            sx={{
              p: 0.5,
              gap: 0.5,
              borderRadius: "xl",
              bgcolor: "background.level1",
              display: "inline-flex",
              mx: "auto",
              [`& .${tabClasses.root}[aria-selected="true"]`]: {
                boxShadow: "sm",
                bgcolor: "background.surface",
                fontWeight: 600,
              },
            }}
          >
            <Tab value={0} disableIndicator>
              Sign up
            </Tab>
            <Tab value={1} disableIndicator>
              Log in
            </Tab>
          </TabList>
        </Tabs>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 0 ? <SignupForm /> : <LoginForm />}
        </motion.div>
      </Stack>
    </MotionCard>
  );
};