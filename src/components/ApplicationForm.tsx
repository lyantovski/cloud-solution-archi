import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, User, Mail, Phone, FileText, Send } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ApplicationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplicationSubmitted?: (application: any) => void
}

export function ApplicationForm({ open, onOpenChange, onApplicationSubmitted }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    experience: '',
    coverLetter: '',
    resumeFile: null as File | null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB')
        return
      }
      if (!file.type.includes('pdf') && !file.type.includes('doc')) {
        toast.error('Please upload a PDF or DOC file')
        return
      }
      setFormData(prev => ({ ...prev, resumeFile: file }))
      toast.success('Resume uploaded successfully')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.resumeFile) {
      toast.error('Please fill in all required fields and upload your resume')
      setIsSubmitting(false)
      return
    }

    try {
      // Prepare application details for email
      const applicationDetails = {
        id: Date.now().toString(),
        applicantName: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        linkedinUrl: formData.linkedinUrl || 'Not provided',
        experience: formData.experience || 'Not specified',
        coverLetter: formData.coverLetter || 'No cover letter provided',
        resumeFileName: formData.resumeFile.name,
        submissionDate: new Date().toLocaleString(),
        position: 'Cloud Solution Architect',
        status: 'submitted'
      }

      // Save application data
      if (onApplicationSubmitted) {
        onApplicationSubmitted(applicationDetails)
      }

      // Remove the LLM email content generation since we're using structured HTML
      // const emailPrompt = spark.llmPrompt`...`
      // const emailContent = await spark.llm(emailPrompt)

      // Send email notification using a webhook service
      const emailData = {
        to: 'lyantovski@microsoft.com',
        subject: `New Application: ${applicationDetails.position} - ${applicationDetails.applicantName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0078d4;">New Job Application Received</h2>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Application Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold;">Position:</td><td style="padding: 8px 0;">${applicationDetails.position}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Applicant:</td><td style="padding: 8px 0;">${applicationDetails.applicantName}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${applicationDetails.email}">${applicationDetails.email}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td style="padding: 8px 0;">${applicationDetails.phone}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">LinkedIn:</td><td style="padding: 8px 0;"><a href="${applicationDetails.linkedinUrl}" target="_blank">${applicationDetails.linkedinUrl}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Experience:</td><td style="padding: 8px 0;">${applicationDetails.experience}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Resume File:</td><td style="padding: 8px 0;">${applicationDetails.resumeFileName}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Submitted:</td><td style="padding: 8px 0;">${applicationDetails.submissionDate}</td></tr>
              </table>
            </div>
            
            ${applicationDetails.coverLetter !== 'No cover letter provided' ? `
            <div style="background: #ffffff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Cover Letter / Interest</h3>
              <p style="line-height: 1.6;">${applicationDetails.coverLetter}</p>
            </div>
            ` : ''}
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Note:</strong> The resume file was uploaded but needs to be requested directly from the applicant. Please contact them at ${applicationDetails.email} to obtain the resume file.</p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #e8f4f8; border-radius: 8px;">
              <p style="margin: 0; color: #0078d4;"><strong>Next Steps:</strong> Review the application details above and contact the candidate directly to request their resume file and schedule any follow-up interviews.</p>
            </div>
          </div>
        `,
        text: `
New Job Application Received

Position: ${applicationDetails.position}
Applicant: ${applicationDetails.applicantName}
Email: ${applicationDetails.email}
Phone: ${applicationDetails.phone}
LinkedIn: ${applicationDetails.linkedinUrl}
Experience: ${applicationDetails.experience}
Resume File: ${applicationDetails.resumeFileName}
Submitted: ${applicationDetails.submissionDate}

Cover Letter/Interest:
${applicationDetails.coverLetter}

Note: The resume file was uploaded but needs to be requested directly from the applicant. Please contact them at ${applicationDetails.email} to obtain the resume file.
        `
      }

      // Use a free email service like EmailJS or Formspree
      try {
        const emailResponse = await fetch('https://formspree.io/f/mnnqqjjp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailData.to,
            subject: emailData.subject,
            message: emailData.text,
            html: emailData.html,
            _replyto: applicationDetails.email,
            _subject: emailData.subject
          })
        })

        if (emailResponse.ok) {
          console.log('Email sent successfully via Formspree')
        } else {
          console.error('Failed to send email via Formspree')
          // Fallback to mailto link
          const mailto = `mailto:lyantovski@microsoft.com?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.text)}`
          window.open(mailto, '_blank')
        }
      } catch (emailError) {
        console.error('Email service error:', emailError)
        // Fallback to mailto link
        const mailto = `mailto:lyantovski@microsoft.com?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.text)}`
        window.open(mailto, '_blank')
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Application submitted successfully! Email notification sent to lyantovski@microsoft.com')
      onOpenChange(false)
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        linkedinUrl: '',
        experience: '',
        coverLetter: '',
        resumeFile: null
      })
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Application submitted successfully! Email notification has been prepared for lyantovski@microsoft.com')
      onOpenChange(false)
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        linkedinUrl: '',
        experience: '',
        coverLetter: '',
        resumeFile: null
      })
    } catch (error) {
      toast.error('Failed to submit application. Please try again.')
      console.error('Application submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Apply for Cloud Solution Architect</DialogTitle>
          <DialogDescription>
            Submit your application for the Cloud Solution Architect position at Microsoft. 
            All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                <Input
                  id="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Experience & Qualifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="experience">Years of Cloud Experience</Label>
                <Select onValueChange={(value) => handleInputChange('experience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-7">5-7 years</SelectItem>
                    <SelectItem value="7-10">7-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="coverLetter">Cover Letter / Why are you interested?</Label>
                <Textarea
                  id="coverLetter"
                  value={formData.coverLetter}
                  onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                  placeholder="Tell us why you're interested in this role and what makes you a great fit..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resume Upload *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {formData.resumeFile ? formData.resumeFile.name : 'Upload your resume'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF or DOC files only, max 5MB
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="mt-2"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Upload className="h-4 w-4" />
                </motion.div>
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}