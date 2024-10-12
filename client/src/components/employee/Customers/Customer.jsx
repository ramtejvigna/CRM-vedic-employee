import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
    const { fatherName } = useParams();
    const [customerDetails, setCustomerDetails] = useState(null);
    const [pdfs, setPdfs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCustomerDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/customers/getCustomerDetails/${fatherName}`);
                setCustomerDetails(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error fetching customer details');
                setLoading(false);
            }
        };

        const getCustomerPdfs = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/customers/getCustomerPdfs/${fatherName}`);
                setPdfs(response.data);
            } catch (err) {
                console.error('Error fetching PDF data', err);
            }
        };

        getCustomerDetails();
        getCustomerPdfs();
    }, [fatherName]);

    const handleDelete = () => {
        console.log("Delete customer");
    };

    const handleEdit = () => {
        console.log("Edit customer");
    };

    const viewPdf = (base64Pdf) => {
        const pdfWindow = window.open();
        pdfWindow.document.write(
            `<iframe width='100%' height='100%' src='data:application/pdf;base64,${base64Pdf}'></iframe>`
        );
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!customerDetails) {
        return <div>No customer details found.</div>;
    }

    return (
        <Box display="flex" flexDirection="column" padding={2} bgcolor="#f4f6f8">
            {/* Profile Card */}
            <Box display="flex" justifyContent="space-between" marginBottom={2}>
                <Box sx={{ width: '55%' }}>
                    <Card variant="outlined" sx={{ height: '300px', boxShadow: 3, borderRadius: 2 }}>
                        <CardContent sx={{ padding: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
                                    Profile
                                </Typography>
                                <Box>
                                    <Button onClick={handleEdit} sx={{ color: 'blue', fontWeight: 'bold', marginRight: 2 }}>
                                        <Edit size={16} style={{ marginRight: 4 }} /> Edit
                                    </Button>
                                    <Button onClick={handleDelete} sx={{ color: 'red', fontWeight: 'bold' }}>
                                        <Delete size={16} style={{ marginRight: 4 }} /> Delete
                                    </Button>
                                </Box>
                            </Box>
                            <Divider sx={{ margin: '20px 0' }} />
                            <Typography variant="body2" sx={{ marginTop: 2, lineHeight: 1.6, color: '#555' }}>
                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography variant="h5" component="span" sx={{ color: '#333' }}>
                                        {customerDetails.fatherName || 'N/A'}
                                    </Typography>
                                </Box>
                                <strong>Father's Name:</strong> <span style={{ color: '#333' }}>{customerDetails.fatherName || 'N/A'}</span><br />
                                <strong>Mother's Name:</strong> <span style={{ color: '#333' }}>{customerDetails.motherName || 'N/A'}</span><br />
                                <strong>Email:</strong> <span style={{ color: '#333' }}>{customerDetails.email || 'N/A'}</span><br />
                                <strong>WhatsApp Number:</strong> <span style={{ color: '#333' }}>{customerDetails.whatsappNumber || 'N/A'}</span><br />
                                <strong>Baby's Gender:</strong> <span style={{ color: '#333' }}>{customerDetails.babyGender || 'N/A'}</span><br />
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Employee Assigned Card */}
                <Box sx={{ width: '45%', marginLeft: 2 }}>
                    <Card variant="outlined" sx={{ height: '350px', boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
                                    Generated PDFs
                                </Typography>
                            </Box>
                            <Divider sx={{ margin: '7px 0' }} />

                            {pdfs.map((pdf, index) => (
                                <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ margin: '10px 0' }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" sx={{ color: "rgb(52, 71, 103)", fontWeight: 'bold' }}>
                                            {new Date(pdf.createdAt).toLocaleDateString()}<br />
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'black' }}>
                                            #{pdf.uniqueId}
                                        </Typography>
                                    </Box>
                                    <Button
                                        onClick={() => viewPdf(pdf.base64Pdf)}
                                        sx={{ color: "rgb(52, 71, 103)", display: 'flex', fontWeight: 'bold', alignItems: 'center' }}
                                    >
                                        <FileText size={16} style={{ marginRight: 4 }} /> PDF
                                    </Button>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Astrological Details Card */}
            <Box display="flex" justifyContent="flex-end" padding={3}>
                <Box sx={{ width: "46%", marginRight: -3, marginTop: -3 }}>
                    <Card variant="outlined" sx={{ height: '300px', boxShadow: 3, borderRadius: 2 }}>
                        <CardContent sx={{ padding: 2 }}>
                            <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
                                Assigned Employee
                            </Typography>
                            <Divider sx={{ margin: '10px 0' }} />
                            {customerDetails.assignedEmployee ? (
                                <Typography variant="body2" sx={{ color: '#555' }}>
                                    <Box sx={{ marginBottom: 2 }}>
                                        <Typography variant="h5" component="span" sx={{ color: '#333' }}>
                                            <strong>{customerDetails.assignedEmployee.name}</strong><br />
                                        </Typography>
                                    </Box>
                                    <strong>Email:</strong> {customerDetails.assignedEmployee.email}<br />
                                    <strong>Contact:</strong> {customerDetails.assignedEmployee.phone}<br />
                                    <strong>Created At:</strong> {new Date(customerDetails.createdDateTime).toLocaleString()}<br />
                                </Typography>
                            ) : (
                                <Typography variant="body2" sx={{ color: '#555' }}>
                                    No employee assigned.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Assigned Employee Card */}
            <Box display="flex" padding={1}>
                <Box sx={{ width: "55%", marginLeft: -1, marginTop: -48 }}>
                    <Card variant="outlined" sx={{ boxShadow: 3, height: '350px', borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: "rgb(52, 71, 103)" }}>
                                Astrological Details
                            </Typography>
                            <Divider sx={{ margin: '10px 0' }} />
                            <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                <strong>Zodiac Sign:</strong> Leo<br />
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                <strong>Nakshatra:</strong> Ashwini<br />
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                <strong>Destiny Number:</strong> 5<br />
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                <strong>Gemstone:</strong> Ruby<br />
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                <strong>Lucky Metal:</strong> Gold<br />
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                <strong>Numerology:</strong> 3<br />
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                <strong>Preferred Starting Letter:</strong> A<br />
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                <strong>Suggested Baby Names:</strong> Aryan, Aadhya
                            </Typography>
                        </CardContent>
                    </Card>

                </Box>
            </Box>
        </Box>
    );
};

export default Customer;