import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, AlertTriangle, ArrowRight, Trophy } from '@phosphor-icons/react'

interface RequirementsCheckerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Requirement {
  id: string
  category: string
  text: string
  weight: number
  essential: boolean
}

const requirements: Requirement[] = [
  {
    id: 'education',
    category: 'Education',
    text: "Bachelor's degree in Computer Science, Engineering, Business, or related field",
    weight: 10,
    essential: true
  },
  {
    id: 'experience',
    category: 'Experience', 
    text: "7+ years of experience in cloud and hybrid infrastructure technologies",
    weight: 20,
    essential: true
  },
  {
    id: 'enterprise',
    category: 'Experience',
    text: "Experience with enterprise-scale application portfolios and cloud-native app hosting",
    weight: 15,
    essential: true
  },
  {
    id: 'azure-ai',
    category: 'Technical Skills',
    text: "Proficiency in Azure AI Foundry",
    weight: 8,
    essential: false
  },
  {
    id: 'azure-apps',
    category: 'Technical Skills', 
    text: "Experience with AKS and App Service",
    weight: 10,
    essential: true
  },
  {
    id: 'azure-data',
    category: 'Technical Skills',
    text: "Knowledge of Azure Cosmos DB, Azure SQL Databases, Azure Database for PostgreSQL",
    weight: 8,
    essential: false
  },
  {
    id: 'integration',
    category: 'Technical Skills',
    text: "Experience with Integration Services (APIM)",
    weight: 5,
    essential: false
  },
  {
    id: 'devops',
    category: 'Technical Skills',
    text: "Strong DevOps skills and experience with GitHub",
    weight: 10,
    essential: true
  },
  {
    id: 'communication',
    category: 'Soft Skills',
    text: "Strong communication skills and ability to lead virtual teams",
    weight: 15,
    essential: true
  },
  {
    id: 'stakeholder',
    category: 'Soft Skills',
    text: "Ability to influence stakeholders and work with C-suite executives",
    weight: 10,
    essential: false
  }
]

export function RequirementsChecker({ open, onOpenChange }: RequirementsCheckerProps) {
  const [checkedRequirements, setCheckedRequirements] = useState<Set<string>>(new Set())
  const [showResults, setShowResults] = useState(false)

  const handleRequirementChange = (requirementId: string, checked: boolean) => {
    setCheckedRequirements(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(requirementId)
      } else {
        newSet.delete(requirementId)
      }
      return newSet
    })
  }

  const calculateScore = () => {
    const totalWeight = requirements.reduce((sum, req) => sum + req.weight, 0)
    const earnedWeight = requirements
      .filter(req => checkedRequirements.has(req.id))
      .reduce((sum, req) => sum + req.weight, 0)
    
    return Math.round((earnedWeight / totalWeight) * 100)
  }

  const getEssentialsMet = () => {
    const essentialRequirements = requirements.filter(req => req.essential)
    const essentialsMet = essentialRequirements.filter(req => checkedRequirements.has(req.id))
    return { met: essentialsMet.length, total: essentialRequirements.length }
  }

  const getFeedback = () => {
    const score = calculateScore()
    const { met, total } = getEssentialsMet()
    
    if (score >= 80 && met === total) {
      return {
        type: 'excellent',
        icon: <Trophy className="h-8 w-8 text-green-500" />,
        title: "Excellent Fit!",
        message: "You meet most requirements for this role. We strongly encourage you to apply!",
        action: "Apply Now"
      }
    } else if (score >= 60 && met >= total * 0.8) {
      return {
        type: 'good',
        icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
        title: "Good Candidate",
        message: "You have strong qualifications. Consider highlighting your transferable skills in your application.",
        action: "Apply with Confidence"
      }
    } else {
      return {
        type: 'developing',
        icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
        title: "Keep Developing",
        message: "You may want to gain more experience in the essential areas before applying.",
        action: "Learn More About Requirements"
      }
    }
  }

  const categorizedRequirements = requirements.reduce((acc, req) => {
    if (!acc[req.category]) {
      acc[req.category] = []
    }
    acc[req.category].push(req)
    return acc
  }, {} as Record<string, Requirement[]>)

  const handleReset = () => {
    setCheckedRequirements(new Set())
    setShowResults(false)
  }

  const score = calculateScore()
  const feedback = getFeedback()
  const { met, total } = getEssentialsMet()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Requirements Checker</DialogTitle>
          <DialogDescription>
            Check off the requirements you meet to see how well you align with this role.
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            {Object.entries(categorizedRequirements).map(([category, reqs]) => (
              <Card key={category}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">{category}</h3>
                  <div className="space-y-3">
                    {reqs.map((requirement) => (
                      <div key={requirement.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={requirement.id}
                          checked={checkedRequirements.has(requirement.id)}
                          onCheckedChange={(checked) => 
                            handleRequirementChange(requirement.id, checked as boolean)
                          }
                          className="mt-1"
                        />
                        <label 
                          htmlFor={requirement.id} 
                          className="text-sm leading-relaxed cursor-pointer flex-1"
                        >
                          {requirement.text}
                          {requirement.essential && (
                            <span className="ml-2 text-xs font-medium text-red-500">*Essential</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Close
              </Button>
              <Button 
                onClick={() => setShowResults(true)} 
                className="flex-1"
                disabled={checkedRequirements.size === 0}
              >
                Check My Fit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Summary */}
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  {feedback.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{feedback.title}</h3>
                <p className="text-muted-foreground mb-6">{feedback.message}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{score}%</div>
                    <div className="text-sm text-muted-foreground">Overall Match</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{met}/{total}</div>
                    <div className="text-sm text-muted-foreground">Essential Requirements</div>
                  </div>
                </div>

                <Progress value={score} className="mb-4" />
              </CardContent>
            </Card>

            {/* Detailed Breakdown */}
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-4">Your Qualifications Breakdown</h4>
                <div className="space-y-3">
                  {requirements.map((req) => (
                    <div key={req.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <CheckCircle 
                          className={`h-5 w-5 ${
                            checkedRequirements.has(req.id) ? 'text-green-500' : 'text-gray-300'
                          }`} 
                        />
                        <span className={`text-sm ${
                          checkedRequirements.has(req.id) ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {req.text}
                        </span>
                      </div>
                      {req.essential && (
                        <span className="text-xs font-medium text-red-500">Essential</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Check Again
              </Button>
              <Button onClick={() => onOpenChange(false)} className="flex-1">
                {feedback.action}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}