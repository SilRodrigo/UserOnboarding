<?php

declare(strict_types=1);

namespace Rsilva\UserOnboarding\Api;

use Magento\Framework\Api\SearchCriteriaInterface;
use Rsilva\UserOnboarding\Api\Data\OnboardingInterface;

interface OnboardingRepositoryInterface
{
    const EQ = 'eq';
    const QTEQ = 'gteq';
    const LTEQ = 'lteq';
    const IN = 'in';
    const LIKE = 'like';
    const TRUE = '1';
    const SORT_ASC = 'ASC';
    const SORT_DESC = 'DESC';

    public function get($id);

    public function save(OnboardingInterface $onboarding);

    public function delete(OnboardingInterface $onboarding);

    public function getList(SearchCriteriaInterface $searchCriteria);
}

