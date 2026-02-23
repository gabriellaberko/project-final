import { useState } from "react";
import { SignupForm } from "../components/forms/SignupForm";
import { LoginForm } from "../components/forms/LoginForm";
import { motion } from "framer-motion";

import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";

const MotionCard = motion(Card);

// TO DO: Fix this page
export const AuthenticationPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent | null,
    newValue: string | number | null) => {
    if (typeof newValue === "number") {
      setActiveTab(newValue);
    }
  };

  return (
    <MotionCard
      layout
      sx={{
        width: "100%",
        maxWidth: 420,
        p: 4,
        boxShadow: "md",
      }}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
        layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      <Stack spacing={4}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="tabs"
          sx={{ alignSelf: "center" }}
        >
          <TabList
            disableUnderline
            sx={{
              p: 0.5,
              gap: 0.5,
              borderRadius: 'xl',
              bgcolor: 'background.level1',
              display: 'inline-flex',
              mx: 'auto',
              [`& .${tabClasses.root}[aria-selected="true"]`]: {
                boxShadow: 'sm',
                bgcolor: 'background.surface',
                fontWeight: 600,
              },
            }}
          >
            <Tab value={0} disableIndicator>Sign up</Tab>
            <Tab value={1} disableIndicator>Log in</Tab>
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
  )
};