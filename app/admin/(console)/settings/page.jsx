// /admin/settings — URL-addressable tabs over the three settings singletons
// plus the account forms. Reads data AND draft straight from Postgres (the
// admin never uses the cached public loaders) and merges the stored document
// over the schema seeds, so a database row missing a newly declared field
// still renders with its seed value.

import { requireAdmin } from '../../../../src/lib/auth';
import { query } from '../../../../src/lib/db';
import { getSingletonSchema, singletonSeedDoc } from '../../../../src/cms/schema';
import SchemaForm from '../../../../src/admin/editor/SchemaForm.jsx';
import SettingsTabs from '../../../../src/admin/settings/SettingsTabs.jsx';
import AccountForms from '../../../../src/admin/settings/AccountForms.jsx';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Settings',
  robots: { index: false, follow: false }
};

const TABS = [
  { id: 'organisation', label: 'Organisation', key: 'site-settings' },
  { id: 'site-text', label: 'Site text', key: 'ui-strings' },
  { id: 'seo', label: 'SEO & tracking', key: 'tracking' },
  { id: 'account', label: 'Account', key: null }
];

const SINGLETON_KEYS = TABS.map((tab) => tab.key).filter(Boolean);

export default async function SettingsPage({ searchParams }) {
  const session = await requireAdmin();

  const params = await searchParams;
  const requested = typeof params?.tab === 'string' ? params.tab : '';
  const active = TABS.some((tab) => tab.id === requested) ? requested : 'organisation';

  const { rows } = await query(
    'select key, data, draft from singletons where key = any($1::text[])',
    [SINGLETON_KEYS]
  );
  const byKey = new Map(rows.map((row) => [row.key, row]));

  const editorPropsFor = (key) => {
    const schema = getSingletonSchema(key);
    const row = byKey.get(key);
    return {
      schema,
      value: { ...singletonSeedDoc(schema), ...(row?.data || {}) },
      draft: row?.draft || null
    };
  };

  return (
    <div className="mx-auto max-w-7xl">
      <header className="reveal">
        <h1 className="font-display display-m text-3xl text-navy-900 sm:text-4xl">Settings</h1>
        <p className="mt-2 text-[15px] text-ink-600">
          Organisation facts, shared interface text, tracking and your own account. Content
          changes stay as drafts until you publish them.
        </p>
      </header>

      <div className="reveal reveal-1 mt-6">
        <SettingsTabs
          tabs={TABS.map(({ id, label }) => ({ id, label }))}
          active={active}
        />
      </div>

      <div className="reveal reveal-2 mt-6">
        {active === 'organisation' && (
          // Settings are facts, not layout: no preview pane here. Page
          // editors keep the live preview; this tab is just the form.
          <SchemaForm
            key="site-settings"
            targetType="singleton"
            targetKey="site-settings"
            {...editorPropsFor('site-settings')}
          />
        )}

        {active === 'site-text' && (
          <SchemaForm
            key="ui-strings"
            targetType="singleton"
            targetKey="ui-strings"
            {...editorPropsFor('ui-strings')}
          />
        )}

        {active === 'seo' && (
          <SchemaForm
            key="tracking"
            targetType="singleton"
            targetKey="tracking"
            {...editorPropsFor('tracking')}
          />
        )}

        {active === 'account' && <AccountForms email={session.email} />}
      </div>
    </div>
  );
}
