import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClipboard,
  FiInfo,
  FiList,
  FiRefreshCw,
} from "react-icons/fi";
import { SERVICE_CHECKLISTS } from "../data/serviceChecklists";

const SECTION_ICONS = {
  requiredDocuments: <FiClipboard size={14} />,
  requiredInformation: <FiInfo size={14} />,
  preparationSteps: <FiList size={14} />,
  commonMistakes: <FiAlertTriangle size={14} />,
  finalChecks: <FiCheckCircle size={14} />,
};

function getItemId(service, sectionKey, item) {
  return `${service}::${sectionKey}::${item}`;
}

export default function DynamicChecklist({ service, onStateChange }) {
  const checklist = SERVICE_CHECKLISTS[service];
  const storageKey = service || "";
  const [checkedItems, setCheckedItems] = useState({});

  const allItems = useMemo(() => {
    if (!checklist) return [];

    return checklist.sections.flatMap((section) =>
      section.items.map((item) => ({
        id: getItemId(service, section.key, item),
        label: item,
        section: section.title,
        sectionKey: section.key,
      })),
    );
  }, [checklist, service]);

  useEffect(() => {
    if (!storageKey) return;

    try {
      const saved = window.localStorage.getItem(storageKey);
      setCheckedItems(saved ? JSON.parse(saved) : {});
    } catch {
      setCheckedItems({});
    }
  }, [storageKey]);

  const completed = allItems.filter((item) => checkedItems[item.id]).length;
  const progress = allItems.length
    ? Math.round((completed / allItems.length) * 100)
    : 0;
  const checkedLabels = useMemo(
    () =>
      allItems
        .filter((item) => checkedItems[item.id])
        .map((item) => item.label),
    [allItems, checkedItems],
  );
  const checkedEntries = useMemo(
    () => allItems.filter((item) => checkedItems[item.id]),
    [allItems, checkedItems],
  );

  useEffect(() => {
    if (!storageKey || !checklist) return;

    window.localStorage.setItem(storageKey, JSON.stringify(checkedItems));
  }, [checkedItems, checklist, storageKey]);

  useEffect(() => {
    if (!service || !onStateChange) return;

    onStateChange({
      service,
      checkedItems,
      checkedLabels,
      checkedEntries,
      completedCount: completed,
      totalCount: allItems.length,
      progress,
    });
  }, [
    allItems.length,
    checkedItems,
    checkedEntries,
    checkedLabels,
    completed,
    onStateChange,
    progress,
    service,
  ]);

  if (!checklist) return null;

  const toggleItem = (id) => {
    setCheckedItems((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const resetChecklist = () => {
    setCheckedItems({});
  };

  return (
    <section className="dynamic-checklist" aria-label={`${service} checklist`}>
      <div className="dynamic-checklist-head">
        <div>
          <p className="dynamic-checklist-kicker">
            <FiClipboard size={13} />
            Service checklist
          </p>
          <h3>{checklist.title}</h3>
        </div>
        <div className="dynamic-checklist-score" aria-label={`${progress}% ready`}>
          <strong>{progress}%</strong>
          <span>ready</span>
        </div>
      </div>

      <div className="dynamic-checklist-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="dynamic-checklist-groups">
        {checklist.sections.map((section) => (
          <div className="dynamic-checklist-group" key={section.key}>
            <h4>
              <span>{SECTION_ICONS[section.key]}</span>
              {section.title}
            </h4>
            <div className="dynamic-checklist-items">
              {section.items.map((item) => {
                const id = getItemId(service, section.key, item);
                const checked = Boolean(checkedItems[id]);

                return (
                  <label
                    className={`dynamic-checklist-item ${
                      checked ? "checked" : ""
                    }`}
                    key={id}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleItem(id)}
                    />
                    <span className="dynamic-checklist-box">
                      {checked && <FiCheckCircle size={15} />}
                    </span>
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="dynamic-checklist-reset"
        onClick={resetChecklist}
      >
        <FiRefreshCw size={13} />
        Reset checklist
      </button>
    </section>
  );
}
