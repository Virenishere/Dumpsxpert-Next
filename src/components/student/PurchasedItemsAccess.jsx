'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PurchasedItemsAccess = () => {
  const [pdfCourses, setPdfCourses] = useState([]);
  const [examCourses, setExamCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserPurchases = async () => {
      try {
        const userId = localStorage.getItem('studentId');
        if (!userId) {
          console.error('No user ID found in localStorage');
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://${process.env.NEXT_PUBLIC_BASE_URL}/api/student/orders`,
          { withCredentials: true }
        );

        const orders = res.data?.orders || [];
        const { pdfCourses, examCourses } = separateCoursesByType(orders);
        
        // Get the most recent 3 items of each type
        setPdfCourses(pdfCourses.slice(0, 3));
        setExamCourses(examCourses.slice(0, 3));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setLoading(false);
      }
    };

    fetchUserPurchases();
  }, []);

  const handleDownload = async (url, filename) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started!');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download file.');
    }
  };

  const handleAttemptExam = async (courseId) => {
    try {
      const res = await axios.get(
        `http://${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/byCourseId/${courseId}`
      );
      const exam = res.data?.data?.[0];

      if (exam?._id) {
        router.push(`/student/courses-exam/instructions/${exam._id}`);
      } else {
        toast.error('No exam found for this course');
      }
    } catch (err) {
      console.error('Error fetching exam:', err);
      toast.error('Failed to get exam. Try again later.');
    }
  };

  if (loading) {
    return (
      <Card className="shadow-md hover:shadow-lg transition duration-300">
        <CardHeader>
          <CardTitle className="text-indigo-600">My Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading your purchases...</p>
        </CardContent>
      </Card>
    );
  }

  if (pdfCourses.length === 0 && examCourses.length === 0) {
    return (
      <Card className="shadow-md hover:shadow-lg transition duration-300">
        <CardHeader>
          <CardTitle className="text-indigo-600">My Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">You haven't purchased any exams or PDFs yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition duration-300">
      <CardHeader>
        <CardTitle className="text-indigo-600">My Purchases</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pdfCourses.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">PDF Materials</h3>
              <div className="space-y-2">
                {pdfCourses.map((course, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="text-sm truncate max-w-[200px]">{course.name}</span>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleDownload(course.downloadUrl, `${course.name}-Main.pdf`)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      PDF
                    </Button>
                  </div>
                ))}
              </div>
              {pdfCourses.length > 3 && (
                <div className="mt-2 text-right">
                  <Button 
                    variant="link" 
                    onClick={() => router.push('/dashboard/student/pdfOrders')}
                    className="text-indigo-600 p-0"
                  >
                    View all PDFs
                  </Button>
                </div>
              )}
            </div>
          )}

          {examCourses.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Online Exams</h3>
              <div className="space-y-2">
                {examCourses.map((course, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm truncate max-w-[200px]">{course.name}</span>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleAttemptExam(course._id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Exam
                    </Button>
                  </div>
                ))}
              </div>
              {examCourses.length > 3 && (
                <div className="mt-2 text-right">
                  <Button 
                    variant="link" 
                    onClick={() => router.push('/dashboard/student/examOrders')}
                    className="text-indigo-600 p-0"
                  >
                    View all exams
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to separate courses by type
function separateCoursesByType(orders = []) {
  const pdfCourses = [];
  const examCourses = [];

  orders.forEach(order => {
    order.courseDetails.forEach(course => {
      if (course.name?.toLowerCase().includes('[pdf]')) {
        pdfCourses.push({
          name: course.name,
          code: course.sapExamCode,
          date: new Date(order.purchaseDate).toLocaleDateString('en-GB'),
          downloadUrl: course.mainPdfUrl || course.samplePdfUrl,
        });
      } else if (course.name?.toLowerCase().includes('[online exam]')) {
        examCourses.push({
          _id: course.courseId,
          name: course.name,
          code: course.sapExamCode,
          createdAt: order.purchaseDate,
        });
      }
    });
  });

  return { pdfCourses, examCourses };
}

export default PurchasedItemsAccess;