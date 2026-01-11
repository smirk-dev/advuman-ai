'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface OnboardingData {
  businessName: string;
  businessType: string;
  industry: string;
  businessStage: string;
  monthlyRevenue: string;
  teamSize: number;
  primaryGoal: string;
  challenges: string[];
}

const businessTypes = ['Solopreneur', 'MSME', 'Professional'];
const industries = ['Technology', 'Retail', 'Services', 'Manufacturing', 'Healthcare', 'Education', 'Other'];
const businessStages = ['Idea', 'MVP', 'Growth', 'Scale'];
const revenueRanges = ['0-10k', '10k-50k', '50k-100k', '100k+'];
const commonChallenges = [
  'Finding customers',
  'Managing finances',
  'Team building',
  'Product development',
  'Marketing & sales',
  'Time management',
];

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    businessName: '',
    businessType: '',
    industry: '',
    businessStage: '',
    monthlyRevenue: '',
    teamSize: 1,
    primaryGoal: '',
    challenges: [],
  });
  const router = useRouter();

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleChallenge = (challenge: string) => {
    setData(prev => ({
      ...prev,
      challenges: prev.challenges.includes(challenge)
        ? prev.challenges.filter(c => c !== challenge)
        : [...prev.challenges, challenge],
    }));
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save profile');

      router.push('/chat');
      router.refresh();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-12 rounded-full ${
                    s <= step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">Step {step} of 5</span>
          </div>
          <CardTitle>
            {step === 1 && 'Tell us about your business'}
            {step === 2 && 'What stage are you at?'}
            {step === 3 && 'Business metrics'}
            {step === 4 && 'Your primary goal'}
            {step === 5 && 'Biggest challenges'}
          </CardTitle>
          <CardDescription>
            This helps us provide personalized advice tailored to your needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={data.businessName}
                  onChange={(e) => updateData('businessName', e.target.value)}
                  placeholder="My Awesome Business"
                />
              </div>
              <div>
                <Label>Business Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {businessTypes.map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={data.businessType === type ? 'default' : 'outline'}
                      onClick={() => updateData('businessType', type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Industry</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {industries.map((industry) => (
                    <Button
                      key={industry}
                      type="button"
                      variant={data.industry === industry ? 'default' : 'outline'}
                      onClick={() => updateData('industry', industry)}
                      className="text-sm"
                    >
                      {industry}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label>Current Stage</Label>
              <div className="grid grid-cols-2 gap-4">
                {businessStages.map((stage) => (
                  <Button
                    key={stage}
                    type="button"
                    variant={data.businessStage === stage ? 'default' : 'outline'}
                    onClick={() => updateData('businessStage', stage)}
                    className="h-20 flex flex-col gap-1"
                  >
                    <span className="font-semibold">{stage}</span>
                    <span className="text-xs text-muted-foreground">
                      {stage === 'Idea' && 'Just starting out'}
                      {stage === 'MVP' && 'Building product'}
                      {stage === 'Growth' && 'Finding traction'}
                      {stage === 'Scale' && 'Expanding fast'}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Monthly Revenue Range</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {revenueRanges.map((range) => (
                    <Button
                      key={range}
                      type="button"
                      variant={data.monthlyRevenue === range ? 'default' : 'outline'}
                      onClick={() => updateData('monthlyRevenue', range)}
                    >
                      ${range}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  type="number"
                  min="1"
                  value={data.teamSize}
                  onChange={(e) => updateData('teamSize', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <Label htmlFor="primaryGoal">What's your primary goal right now?</Label>
              <textarea
                id="primaryGoal"
                className="w-full min-h-[120px] mt-2 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                value={data.primaryGoal}
                onChange={(e) => updateData('primaryGoal', e.target.value)}
                placeholder="e.g., Increase revenue by 50%, Launch new product, Build a team..."
              />
            </div>
          )}

          {step === 5 && (
            <div>
              <Label>Select your biggest challenges (choose multiple)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {commonChallenges.map((challenge) => (
                  <Button
                    key={challenge}
                    type="button"
                    variant={data.challenges.includes(challenge) ? 'default' : 'outline'}
                    onClick={() => toggleChallenge(challenge)}
                    className="text-sm"
                  >
                    {challenge}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            {step < 5 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="ml-auto"
                disabled={
                  (step === 1 && !data.businessName) ||
                  (step === 1 && !data.businessType) ||
                  (step === 1 && !data.industry) ||
                  (step === 2 && !data.businessStage)
                }
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className="ml-auto"
                disabled={loading || data.challenges.length === 0}
              >
                {loading ? 'Saving...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
