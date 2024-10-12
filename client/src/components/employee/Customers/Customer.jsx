import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Divider,
    CircularProgress,
} from '@mui/material';
import { Edit, Delete, FileText } from 'lucide-react';

const Customer = () => {
    const location = useLocation();
    const { customerData, section } = location.state || {};
    const [customerDetails, setCustomerDetails] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [pdfs, setPdfs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getCustomerDetails = async () => {
            setCustomerDetails(customerData);
            console.log(customerData)
            setLoading(false);
        };


        getCustomerDetails();
    }, [customerData]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!customerDetails) {
        return <div>No customer details found.</div>;
    }

    return (
        <Box display="flex" flexDirection="column" padding={2} className="gap-5">
            {/* Profile Card */}
            <Box>
                <Box>
                    <Card variant="outlined" sx={{ height: '300px', boxShadow: 3, borderRadius: 2 }}>
                        <CardContent sx={{ padding: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
                                    Profile
                                </Typography>
                            </Box>
                            <Divider sx={{ margin: '20px 0' }} />
                            <Typography variant="body2" sx={{ marginTop: 2, lineHeight: 1.6, color: '#555' }}>
                                <strong>Father's Name:</strong> <span style={{ color: '#333' }}>{customerDetails.fatherName || 'N/A'}</span><br />
                                <strong>Mother's Name:</strong> <span style={{ color: '#333' }}>{customerDetails.motherName || 'N/A'}</span><br />
                                <strong>Email:</strong> <span style={{ color: '#333' }}>{customerDetails.email || 'N/A'}</span><br />
                                <strong>WhatsApp Number:</strong> <span style={{ color: '#333' }}>{customerDetails.whatsappNumber || 'N/A'}</span><br />
                                <strong>Baby's Gender:</strong> <span style={{ color: '#333' }}>{customerDetails.babyGender || 'N/A'}</span><br />
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Assigned Employee Card */}
            <Box display="flex" className="flex flex-row justify-between gap-5">
                <Box className="w-1/2">
                    <Card variant="outlined" sx={{ boxShadow: 3, height: '350px', borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
                                Astrological Details
                            </Typography>
                            <Divider sx={{ margin: '10px 0' }} />

                            {/* Grid for two-column layout */}
                            <Grid container spacing={2} className="p-10">
                                {/* First column */}
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                        <strong>Zodiac Sign:</strong> Leo<br />
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                        <strong>Destiny Number:</strong> 5<br />
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                        <strong>Gemstone:</strong> Ruby<br />
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                        <strong>Numerology:</strong> 3<br />
                                    </Typography>
                                </Grid>

                                {/* Second column */}
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                        <strong>Nakshatra:</strong> Ashwini<br />
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                        <strong>Lucky Metal:</strong> Gold<br />
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                        <strong>Preferred Starting Letter:</strong> A<br />
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                        <strong>Suggested Baby Names:</strong> Aryan, Aadhya
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
                <div className='w-1/2'>
                    <textarea
                        onChange={(e) => setFeedback(e.target.value)}
                        className="rounded-xl p-2 mb-4 h-1/2 w-full resize-none bg-slate-200 border-none"
                    />
                    <button
                        className="p-2 px-4 bg-blue-500 text-white rounded-lg"
                        onClick={() => {
                            navigate('generate-pdf', {
                                state: {
                                    customerData: customerData
                                },
                            })
                        }}
                    >
                        Generate PDF
                    </button>
                </div>
            </Box>
        </Box>
    );
};

export default Customer;