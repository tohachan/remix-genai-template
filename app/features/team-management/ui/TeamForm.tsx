import React, { useState, useEffect } from 'react';
import { useCreateTeam, useUpdateTeam } from '../hooks';
import type { Team, CreateTeamData, UpdateTeamData } from '~/entities/team';
import { Button } from '~/shared/ui/button';
import { Input } from '~/shared/ui/input';
import { Label } from '~/shared/ui/label';
import { Textarea } from '~/shared/ui/textarea';
import { Card } from '~/shared/ui/card';
import { theme } from '~/shared/design-system/theme';

interface TeamFormProps {
  team?: Team;
  onSuccess?: (team: Team) => void;
  onCancel?: () => void;
}

const TEAM_COLORS = [
  theme.colors.primary[500], // Blue
  theme.colors.success[500], // Green
  theme.colors.warning[500], // Yellow
  theme.colors.error[500], // Red
  theme.colors.purple[500], // Purple
  theme.colors.cyan[500], // Cyan
  theme.colors.lime[500], // Lime
  theme.colors.orange[500], // Orange
];

export const TeamForm: React.FC<TeamFormProps> = ({
  team,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateTeamData>({
    name: '',
    description: '',
    color: TEAM_COLORS[0] || theme.colors.primary[500],
    avatar: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createTeam, isCreating, error: createError } = useCreateTeam();
  const { updateTeam, isUpdating, error: updateError } = useUpdateTeam();

  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;

  // Initialize form data when editing
  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        description: team.description,
        color: team.color,
        avatar: team.avatar || '',
      });
    }
  }, [team]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Team name must be at least 2 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Team name must be less than 50 characters';
    }

    if (formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    if (formData.avatar && !isValidUrl(formData.avatar)) {
      newErrors.avatar = 'Please enter a valid URL for the avatar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (field: keyof CreateTeamData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let result;

      if (team) {
        // Update existing team
        const updateData: UpdateTeamData = {};

        if (formData.name !== team.name) {
          updateData.name = formData.name;
        }
        if (formData.description !== team.description) {
          updateData.description = formData.description;
        }
        if (formData.color !== team.color) {
          updateData.color = formData.color;
        }
        if (formData.avatar !== team.avatar && formData.avatar !== undefined) {
          updateData.avatar = formData.avatar;
        }

        result = await updateTeam(team.id, updateData);
      } else {
        // Create new team
        result = await createTeam(formData);
      }

      if (result.success && result.team) {
        onSuccess?.(result.team);
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleReset = () => {
    if (team) {
      setFormData({
        name: team.name,
        description: team.description,
        color: team.color,
        avatar: team.avatar || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: TEAM_COLORS[0] || theme.colors.primary[500],
        avatar: '',
      });
    }
    setErrors({});
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          {team ? 'Edit Team' : 'Create New Team'}
        </h2>
        <p className="text-gray-600 mt-1">
          {team ? 'Update your team information' : 'Set up a new team for collaboration'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Name */}
        <div>
          <Label htmlFor="name">Team Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter team name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe what this team works on..."
            rows={3}
            className={errors.description ? 'border-red-500' : ''}
          />
          <p className="text-gray-500 text-sm mt-1">
            {formData.description.length}/200 characters
          </p>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Team Color */}
        <div>
          <Label>Team Color</Label>
          <div className="grid grid-cols-8 gap-2 mt-2">
            {TEAM_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-10 h-10 rounded-full border-2 ${
                  formData.color === color ? 'border-gray-800' : 'border-gray-300'
                } hover:border-gray-600 transition-colors`}
                style={{ backgroundColor: color }}
                onClick={() => handleChange('color', color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Avatar URL */}
        <div>
          <Label htmlFor="avatar">Avatar URL (Optional)</Label>
          <Input
            id="avatar"
            value={formData.avatar}
            onChange={(e) => handleChange('avatar', e.target.value)}
            placeholder="https://example.com/avatar.png"
            className={errors.avatar ? 'border-red-500' : ''}
          />
          {errors.avatar && (
            <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
          )}
          {formData.avatar && !errors.avatar && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={formData.avatar}
                alt="Avatar preview"
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  setErrors(prev => ({ ...prev, avatar: 'Failed to load avatar image' }));
                }}
              />
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">
              Error: {error.toString()}
            </p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex space-x-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="ml-auto"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {team ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              team ? 'Update Team' : 'Create Team'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
