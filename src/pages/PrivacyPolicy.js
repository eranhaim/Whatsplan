import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext";

const PrivacyPolicy = () => {
    const { translations } = useLanguage();

    return (
        <Container maxWidth="md">
            <Box py={4}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {translations.privacyPolicy}
                </Typography>

                <Typography variant="body1" paragraph>
                    {translations.lastUpdated}:{" "}
                    {new Date().toLocaleDateString()}
                </Typography>

                <Typography variant="h5" gutterBottom>
                    {translations.informationWeCollect}
                </Typography>
                <Typography variant="body1" paragraph>
                    {translations.informationWeCollectText}
                </Typography>

                <Typography variant="h5" gutterBottom>
                    {translations.howWeUseYourInformation}
                </Typography>
                <Typography variant="body1" paragraph>
                    {translations.howWeUseYourInformationText}
                </Typography>

                <Typography variant="h5" gutterBottom>
                    {translations.dataSecurity}
                </Typography>
                <Typography variant="body1" paragraph>
                    {translations.dataSecurityText}
                </Typography>

                <Typography variant="h5" gutterBottom>
                    {translations.thirdPartyServices}
                </Typography>
                <Typography variant="body1" paragraph>
                    {translations.thirdPartyServicesText}
                </Typography>

                <Typography variant="h5" gutterBottom>
                    {translations.contactUs}
                </Typography>
                <Typography variant="body1" paragraph>
                    {translations.contactUsText}
                </Typography>
            </Box>
        </Container>
    );
};

export default PrivacyPolicy;
