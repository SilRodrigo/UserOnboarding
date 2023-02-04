<?php

declare(strict_types=1);

namespace Rsilva\UserOnboarding\Api\Data;

interface OnboardingInterface
{

    const ENABLED = 'enabled';
    const ONBOARDING_ID = 'entity_id';
    const NAME = 'name';
    const PAGE_URL = 'page_url';
    const ONBOARDING_CONTENT = 'onboarding';
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    /**
     * Set/Get attribute wrapper
     *
     * @param   string $method
     * @param   array $args
     * @return  mixed
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function __call();
}
