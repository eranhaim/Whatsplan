import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext";

const TermsOfService = () => {
    const { translations } = useLanguage();

    return (
        <Container maxWidth="md">
            <Box py={4}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {translations.termsOfService}
                </Typography>

                <Typography variant="body1" paragraph>
                    {translations.lastUpdated}:{" "}
                    {new Date().toLocaleDateString()}
                </Typography>

                <Typography variant="h5" gutterBottom>
                    {translations.acceptanceOfTerms}
                </Typography>
                <Typography variant="body1" paragraph>
                    {translations.acceptanceOfTermsText}
                </Typography>

                <Typography variant="h5" gutterBottom>
                    {translations.descriptionOfService}
                </Typography>
                <Typography variant="body1" paragraph>
                    {translations.descriptionOfServiceText}
                </Typography>

                <Typography variant="h5" gutterBottom>
                    {translations.googleApiPolicy}
                </Typography>
                <Typography variant="body1" paragraph>
                    {translations.googleApiPolicyText}
                </Typography>

                <Typography variant="h5" gutterBottom>
                    {translations.userObligations}
                </Typography>
                <Typography variant="body1" paragraph>
                    {translations.userObligationsText}
                </Typography>

                <Typography variant="h5" gutterBottom>
                    {translations.limitationOfLiability}
                </Typography>
                <Typography variant="body1" paragraph>
                    {translations.limitationOfLiabilityText}
                </Typography>

                <Typography variant="h5" gutterBottom>
                    {translations.changesToTerms}
                </Typography>
                <Typography variant="body1" paragraph>
                    {translations.changesToTermsText}
                </Typography>

                <Typography variant="h5" gutterBottom>
                    {translations.contactInformation}
                </Typography>
                <Typography variant="body1" paragraph>
                    {translations.contactInformationText}
                </Typography>
            </Box>
        </Container>
    );
};

export default TermsOfService;
